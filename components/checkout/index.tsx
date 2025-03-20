import { ICart } from '@/redux/cart/cart.interface'
import { useCreateOrderSepayMutation, useGetDistrictQuery, useGetProvinceQuery, useGetWardQuery, useOrderMutation } from '@/redux/order/order.query'
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { formatPrice } from '@/helpers/formatPrice'
import { Picker } from '@react-native-picker/picker'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import CustomButton from '../custombutton'
import Toast from 'react-native-toast-message'
import { useRouter } from 'expo-router'
import { CartActions } from '@/redux/cart/cart.slice'
import { eventEmitter } from '@/helpers/eventEmitter'
import CheckoutQr from './checkout-qr'

interface IProps {
    open: boolean,
    onClose: () => void,
    products: ICart[],
    isCart?: boolean,
    totalBuyNow?: number
}

interface ILocation {
    province: {
        id: number | null,
        name: string
    },
    district: {
        id: number | null,
        name: string
    },
    ward: {
        id: string | null,
        name: string
    }
}

interface IOrderForm {
    name: string
    phone: string
    address: string
    note: string
    paymentMethod: 'COD' | 'SEPAY'
}

// Schema validation sử dụng yup
const validationSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập họ tên'),
    phone: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    address: yup.string().required('Vui lòng nhập địa chỉ'),
    note: yup.string(),
    paymentMethod: yup.string().required('Vui lòng chọn phương thức thanh toán')
})

const CheckoutForm = ({
    open,
    onClose,
    products = [],
    isCart = true,
    totalBuyNow = 0
}: IProps) => {
    const router = useRouter()
    const { socket } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const [createOrder, { isLoading, error }] = useOrderMutation()
    const [createOrderSepay, { isLoading: loadingSepay, error: errorSepay }] = useCreateOrderSepayMutation()
    const { totalAmount } = useAppSelector(state => state.cart)
    const { isAuthenticated } = useAppSelector(state => state.auth)
    const [location, setLocation] = useState<ILocation>({
        province: {
            id: null,
            name: "",
        },
        district: {
            id: null,
            name: "",
        },
        ward: {
            id: null,
            name: "",
        },
    });
    const [qrcode, setQrcode] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const { data: provinces = [], isLoading: isLoadingProvinces } = useGetProvinceQuery();
    const { data: districts = [], isLoading: isLoadingDistricts } = useGetDistrictQuery(
        location.province.id,
        { skip: !location.province.id }
    );
    const { data: wards = [], isLoading: isLoadingWards } = useGetWardQuery(
        location.district.id,
        { skip: !location.district.id }
    );

    const handlePaymentSuccess = (id: string) => {
        console.log({ id });
        if (id === sessionId) {
            Toast.show({
                type: "success",
                text1: "📢 Đặt hàng thành công",
                text2: "Cảm ơn quý khách đã tin tưởng sản phẩm Teelab ❤️"
            })
            if (isCart) {
                dispatch(CartActions.clearCart())
            }
            eventEmitter.emit('createOrder');
            router.replace('/orders')
        }
    }

    useEffect(() => {
        if (socket && sessionId) {
            socket.on("paymentSuccess", handlePaymentSuccess)

            return () => {
                socket.off("paymentSuccess", handlePaymentSuccess)
            }
        }
    }, [socket, sessionId])

    if (error) {
        Toast.show({
            type: "error",
            text1: error?.message || "Có lỗi xảy ra khi đặt hàng"
        })
    }

    if (errorSepay) {
        Toast.show({
            type: "error",
            text1: errorSepay?.message || "Có lỗi xảy ra khi tạo thanh toán"
        })
    }

    // Khởi tạo formik
    const formik = useFormik<IOrderForm>({
        initialValues: {
            name: '',
            phone: '',
            address: '',
            note: '',
            paymentMethod: 'COD'
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!isAuthenticated) {
                router.replace('/login')
                return
            }

            const payloadOrder = {
                ...values,
                ...location,
                products,
                totalAmount: isCart ? totalAmount : totalBuyNow,
            }

            switch (values.paymentMethod) {
                case "COD":
                    const resCod = await createOrder({
                        order: payloadOrder,
                        method: 'cod'
                    }).unwrap()
                    if (resCod?._id) {
                        Toast.show({
                            type: "success",
                            text1: "📢 Đặt hàng thành công",
                            text2: "Cảm ơn quý khách đã tin tưởng sản phẩm Teelab ❤️"
                        })
                        if (isCart) {
                            dispatch(CartActions.clearCart())
                        }
                        eventEmitter.emit('createOrder');
                        router.replace('/orders')
                        break
                    }
                case "SEPAY":
                    const resSessionId = await createOrderSepay(payloadOrder).unwrap()
                    if (resSessionId) {
                        const qrTem = `https://qr.sepay.vn/img?acc=96247TEELABVIP1&bank=BIDV&amount=${isCart ? totalAmount : totalBuyNow}&des=${resSessionId}`
                        setQrcode(qrTem)
                        setSessionId(resSessionId)
                    }
                default:
                    break
            }
        }
    });

    // Kiểm tra xem location có đủ thông tin không
    const isLocationValid = () => {
        return location.province.id && location.district.id && location.ward.id;
    };

    // Hiển thị lỗi từ formik
    const showError = (fieldName: keyof IOrderForm) => {
        return formik.touched[fieldName] && formik.errors[fieldName] ? (
            <Text className="text-red-500 text-xs mt-1">{formik.errors[fieldName]}</Text>
        ) : null;
    };

    // Hiển thị lỗi cho location
    const showLocationError = () => {
        if (formik.submitCount > 0 && !isLocationValid()) {
            return <Text className="text-red-500 text-xs mt-1">Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</Text>;
        }
        return null;
    };

    if (!open || !products.length) return null;

    return (
        <Modal
            visible={open}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-gray-50">
                <View className="bg-white py-4 px-4 shadow-sm">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold">Thông tin đặt hàng</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1 px-4 pt-4">
                    {/* Thông tin sản phẩm */}
                    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <Text className="text-base font-semibold mb-3">Đơn hàng ({products.length} sản phẩm)</Text>
                        <View className="h-0.5 bg-gray-100 mb-3" />

                        {products.map((item, index) => (
                            <View key={`checkout-item-${index}`} className="flex-row mb-3">
                                <View className="w-16 h-16 rounded-md overflow-hidden mr-3">
                                    <View className="absolute top-0 right-0 bg-blue-500 z-10 rounded-full w-5 h-5 items-center justify-center">
                                        <Text className="text-white text-xs">{item.quantity}</Text>
                                    </View>
                                    <View className="w-full h-full bg-gray-200">
                                        {item.image && (
                                            <View className="w-full h-full">
                                                <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-medium" numberOfLines={1}>{item.name}</Text>
                                    <View className="flex-row mt-1">
                                        {item.size && (
                                            <View className="bg-gray-100 rounded px-2 mr-2">
                                                <Text className="text-xs">Size: {item.size}</Text>
                                            </View>
                                        )}
                                        {item.color && (
                                            <View className="bg-gray-100 rounded px-2">
                                                <Text className="text-xs">Màu: {item.color}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-gray-500 text-sm mt-1">
                                        {formatPrice(item.price)}đ x {item.quantity}
                                    </Text>
                                </View>
                                <View>
                                    <Text className="font-bold">{formatPrice(item.price * item.quantity)}đ</Text>
                                </View>
                            </View>
                        ))}

                        <View className="h-0.5 bg-gray-100 my-3" />
                        <View className="flex-row justify-between">
                            <Text className="font-medium">Tạm tính:</Text>
                            <Text className="font-bold">{formatPrice(isCart ? totalAmount : totalBuyNow)}đ</Text>
                        </View>
                    </View>

                    {/* Form thông tin người nhận */}
                    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <Text className="text-base font-semibold mb-3">Thông tin người nhận</Text>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Họ tên</Text>
                            <TextInput
                                className={`border rounded-lg p-3 ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nhập họ tên"
                                value={formik.values.name}
                                onChangeText={formik.handleChange('name')}
                                onBlur={formik.handleBlur('name')}
                            />
                            {showError('name')}
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Số điện thoại</Text>
                            <TextInput
                                className={`border rounded-lg p-3 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nhập số điện thoại"
                                keyboardType="phone-pad"
                                value={formik.values.phone}
                                onChangeText={formik.handleChange('phone')}
                                onBlur={formik.handleBlur('phone')}
                            />
                            {showError('phone')}
                        </View>

                        <Text className="text-base font-semibold mb-3">Địa chỉ giao hàng</Text>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Tỉnh/Thành phố</Text>
                            {isLoadingProvinces ? (
                                <ActivityIndicator />
                            ) : (
                                <View className={`border rounded-lg ${!location.province.id && formik.submitCount > 0 ? 'border-red-500' : 'border-gray-300'}`}>
                                    <Picker
                                            className='py-2 mx-1'
                                        selectedValue={location.province.id?.toString() || ''}
                                        onValueChange={(itemValue) => {
                                            if (itemValue) {
                                                const selectedProvince = provinces.find(p => p.ProvinceID.toString() === itemValue);
                                                setLocation({
                                                    ...location,
                                                    province: {
                                                        id: selectedProvince?.ProvinceID || null,
                                                        name: selectedProvince?.ProvinceName || ''
                                                    },
                                                    district: { id: null, name: '' },
                                                    ward: { id: null, name: '' }
                                                });
                                            }
                                        }}
                                    >
                                        <Picker.Item label="Chọn Tỉnh/Thành phố" value="" />
                                        {provinces?.map((province) => (
                                            <Picker.Item
                                                key={province.ProvinceID}
                                                label={province.ProvinceName}
                                                value={province.ProvinceID.toString()}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Quận/Huyện</Text>
                            {isLoadingDistricts ? (
                                <ActivityIndicator />
                            ) : (
                                <View className={`border rounded-lg ${!location.district.id && formik.submitCount > 0 ? 'border-red-500' : 'border-gray-300'}`}>
                                    <Picker
                                            className='py-2 mx-1'
                                        enabled={!!location.province.id}
                                        selectedValue={location.district.id?.toString() || ''}
                                        onValueChange={(itemValue) => {
                                            if (itemValue) {
                                                const selectedDistrict = districts.find(d => d.DistrictID.toString() === itemValue);
                                                setLocation({
                                                    ...location,
                                                    district: {
                                                        id: selectedDistrict?.DistrictID || null,
                                                        name: selectedDistrict?.DistrictName || ''
                                                    },
                                                    ward: { id: null, name: '' }
                                                });
                                            }
                                        }}
                                    >
                                        <Picker.Item label="Chọn Quận/Huyện" value="" />
                                        {districts?.map((district) => (
                                            <Picker.Item
                                                key={district.DistrictID}
                                                label={district.DistrictName}
                                                value={district.DistrictID.toString()}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Phường/Xã</Text>
                            {isLoadingWards ? (
                                <ActivityIndicator />
                            ) : (
                                <View className={`border rounded-lg ${!location.ward.id && formik.submitCount > 0 ? 'border-red-500' : 'border-gray-300'}`}>
                                    <Picker
                                            className='py-2 mx-1'
                                        enabled={!!location.district.id}
                                        selectedValue={location.ward.id?.toString() || ''}
                                        onValueChange={(itemValue) => {
                                            if (itemValue) {
                                                const selectedWard = wards.find(w => w.WardCode === itemValue);
                                                setLocation({
                                                    ...location,
                                                    ward: {
                                                        id: selectedWard?.WardCode || null,
                                                        name: selectedWard?.WardName || ''
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <Picker.Item label="Chọn Phường/Xã" value="" />
                                        {wards?.map((ward) => (
                                            <Picker.Item
                                                key={ward.WardCode}
                                                label={ward.WardName}
                                                value={ward.WardCode}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>
                        {showLocationError()}

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Địa chỉ chi tiết</Text>
                            <TextInput
                                className={`border rounded-lg p-3 ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Số nhà, tên đường..."
                                value={formik.values.address}
                                onChangeText={formik.handleChange('address')}
                                onBlur={formik.handleBlur('address')}
                            />
                            {showError('address')}
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-1">Ghi chú (không bắt buộc)</Text>
                            <TextInput
                                className="border rounded-lg p-3 border-gray-300"
                                placeholder="Ghi chú về đơn hàng"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                value={formik.values.note}
                                onChangeText={formik.handleChange('note')}
                            />
                        </View>
                    </View>

                    {/* Phương thức thanh toán */}
                    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <Text className="text-base font-semibold mb-3">Phương thức thanh toán</Text>

                        <TouchableOpacity
                            className={`flex-row items-center border rounded-lg p-3 mb-3 ${formik.values.paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                            onPress={() => formik.setFieldValue('paymentMethod', 'COD')}
                        >
                            <View className={`w-5 h-5 rounded-full mr-2 border ${formik.values.paymentMethod === 'COD' ? 'border-blue-500' : 'border-gray-400'} items-center justify-center`}>
                                {formik.values.paymentMethod === 'COD' && (
                                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium">Thanh toán khi nhận hàng (COD)</Text>
                                <Text className="text-xs text-gray-500 mt-1">Thanh toán khi nhận được hàng</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center border rounded-lg p-3 mb-3 ${formik.values.paymentMethod === 'SEPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                            onPress={() => formik.setFieldValue('paymentMethod', 'SEPAY')}
                        >
                            <View className={`w-5 h-5 rounded-full mr-2 border ${formik.values.paymentMethod === 'SEPAY' ? 'border-blue-500' : 'border-gray-400'} items-center justify-center`}>
                                {formik.values.paymentMethod === 'SEPAY' && (
                                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium">Thanh toán qua QR</Text>
                                <Text className="text-xs text-gray-500 mt-1">Thanh toán an toàn và nhanh chóng với QR</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            qrcode && formik.values.paymentMethod === 'SEPAY' && <CheckoutQr {...{ qrcode }} />
                        }
                        {showError('paymentMethod')}
                    </View>

                    {/* Tổng tiền & Nút thanh toán */}
                    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-gray-500">Tạm tính:</Text>
                            <Text className="text-gray-800 font-medium">{formatPrice(isCart ? totalAmount : totalBuyNow)}đ</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-gray-500">Phí vận chuyển:</Text>
                            <Text className="text-gray-800 font-medium">0đ</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-3 border-t border-gray-100 mt-2 mb-4">
                            <Text className="text-gray-800 font-bold text-base">Tổng thanh toán:</Text>
                            <Text className="font-bold text-lg">{formatPrice(isCart ? totalAmount : totalBuyNow)}đ</Text>
                        </View>
                        <CustomButton
                            label={formik.values.paymentMethod === 'SEPAY' ? (qrcode ? "Vui lòng quét mã QR" : "Tạo QR thanh toán") : "Đặt hàng"}
                            icon="arrow-forward-outline"
                            size="lg"
                            onPress={() => {
                                if (!isLocationValid()) {
                                    formik.submitForm();
                                    return;
                                }
                                formik.handleSubmit();
                            }}
                            variant="primary"
                            loading={isLoading || loadingSepay}
                            disabled={qrcode ? true : false}
                        />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

export default CheckoutForm