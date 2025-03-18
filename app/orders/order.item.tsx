import CustomButton from "@/components/custombutton";
import { statusColors, statusTranslations } from "@/const";
import { formatPrice } from "@/helpers/formatPrice";
import { IOrder } from "@/redux/order/order.interface";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import ConfirmModal from "./order.confirm";
import ReviewModal from "./order.review";

interface IProps {
    order: IOrder;
    onPressComplete: (orderId: string) => void;
    onPressCancel: (orderId: string) => void;
    loadingUpdate: boolean
    refetch: () => void
}

interface IModalConfig {
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    variantColor: string;
    onConfirm: () => void;
    loadingUpdate?: boolean
}

interface IProduct {
    productId: string;
    productName: string;
    productImage: string;
    orderId: string;
}

const OrderItem = ({ order, onPressComplete, onPressCancel, loadingUpdate, refetch}: IProps) => {
    const [modalConfig, setModalConfig] = useState<IModalConfig>({
        visible: false,
        title: '',
        message: '',
        confirmText: '',
        variantColor: 'danger',
        onConfirm: () => { }
    });
    const [openReview, setOpenReview] = useState<boolean>(false)
    const [productSelected, setProductSelected] = useState<IProduct | null>(null);
    const status = order.status;
    const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const showCancelModal = () => {
        setModalConfig({
            visible: true,
            title: 'Xác nhận hủy đơn',
            message: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
            confirmText: 'Có, hủy đơn',
            variantColor: 'danger',
            onConfirm: () => {
                setModalConfig(prev => ({ ...prev, visible: false }));
                onPressCancel(order._id);
            }
        });
    };

    const showCompleteModal = () => {
        setModalConfig({
            visible: true,
            title: 'Xác nhận đã nhận hàng',
            message: 'Bạn xác nhận đã nhận được đơn hàng này?',
            confirmText: 'Đã nhận hàng',
            variantColor: 'primary',
            onConfirm: () => {
                setModalConfig(prev => ({ ...prev, visible: false }));
                onPressComplete(order._id);
            }
        });
    };

    const openReviewOrder = (product: IProduct) => {
        setProductSelected(product);
        setOpenReview(true);
    }

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, visible: false }));
    };

    return (
        <TouchableOpacity
            className="bg-white mb-3 rounded-lg shadow-sm overflow-hidden border border-gray-100"
        >
            {productSelected && (
                <ReviewModal
                    visible={openReview}
                    onClose={() => setOpenReview(false)}
                    productName={productSelected.productName}
                    productImage={productSelected.productImage}
                    productId={productSelected.productId}
                    orderId={productSelected.orderId}
                    refetch={refetch}
                />
            )}
            <ConfirmModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText="Không"
                onConfirm={modalConfig.onConfirm}
                onCancel={closeModal}
                variantColor={modalConfig.variantColor}
                loadingUpdate={loadingUpdate}
            />
            {/* Order header */}
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Feather name="shopping-bag" size={16} color="#4B5563" />
                    <Text className="ml-2 font-medium text-gray-800 uppercase">Đơn #{order._id.substring(order._id.length - 8)}</Text>
                </View>
                <View
                    style={{ backgroundColor: statusColors[status].bg }}
                    className="px-3 py-1 rounded-full"
                >
                    <Text style={{ color: statusColors[status].text }} className="text-xs font-medium">
                        {statusTranslations[status]}
                    </Text>
                </View>
            </View>

            {/* Order products */}
            <View className="p-4">
                {order.products.slice(0, 2).map((product, index) => (
                    <View key={`${order._id}-${index}`} className="flex-row mb-3">
                        <Image
                            source={{ uri: product.image }}
                            className="w-16 h-16 rounded-md bg-gray-100"
                        />
                        <View className="ml-3 flex-1 justify-center">
                            <Text className="font-medium text-gray-800" numberOfLines={1}>{product.name}</Text>
                            <Text className="text-gray-500 text-xs mt-1">
                                {product.size && `Size: ${product.size}`}
                                {product.color && ` | Màu: ${product.color}`}
                            </Text>
                            <View className="flex-row justify-between mt-1">
                                <Text className="text-gray-600">{formatPrice(product.price)} x {product.quantity}</Text>
                            </View>
                        </View>
                    </View>
                ))}

                {order.products.length > 2 && (
                    <Text className="text-gray-500 text-center mt-1">
                        +{order.products.length - 2} sản phẩm khác
                    </Text>
                )}

                {/* Order total */}
                <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between">
                    <Text className="text-gray-500">{order.products.reduce((sum, p) => sum + p.quantity, 0)} sản phẩm</Text>
                    <View className="flex-row">
                        <Text className="text-gray-500 mr-1">Tổng tiền:</Text>
                        <Text className="font-bold text-gray-800">{formatPrice(order.totalAmount)}đ</Text>
                    </View>
                </View>

                {/* Order date */}
                <Text className="text-xs text-gray-500 mt-3">Đặt hàng: {formattedDate}</Text>

                {/* Order actions */}
                <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
                    {(status === 'pending' || status === 'processing') && (
                        <CustomButton
                            label="Hủy đơn"
                            onPress={showCancelModal}
                            variant="danger"
                        />
                    )}

                    {status === 'shipping' && (
                        <CustomButton
                            label="Đã nhận hàng"
                            onPress={showCompleteModal}
                            variant="primary"
                        />
                    )}

                    {status === 'delivered' && (
                        <View className="flex-row">
                            {order.products.map((product) => (
                                <CustomButton
                                    key={`review-${product.productId}`}
                                    label={product.isReviewed ? 'Đã đánh giá' : 'Đánh giá'}
                                    onPress={() => {
                                        if (product.isReviewed) return;
                                        openReviewOrder({
                                            productId: product.productId,
                                            orderId: order._id,
                                            productImage: product.image,
                                            productName: product.name
                                        })
                                    }}
                                    variant="dark"
                                    disabled={product.isReviewed || false}
                                />
                            )).slice(0, 1)}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderItem