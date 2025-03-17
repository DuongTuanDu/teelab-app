import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Feather } from '@expo/vector-icons';
import CartItem from './cart.item';
import { formatPrice } from '@/helpers/formatPrice';
import CheckoutForm from '../checkout';
import Toast from 'react-native-toast-message';
import CustomButton from '../custombutton';

const CartList = () => {
    const dispatch = useAppDispatch();
    const { carts, totalAmount } = useAppSelector(state => state.cart);
    const [open, setOpen] = useState<boolean>(false)

    const handleCheckout = () => {
        if (!carts.length) {
            Toast.show({
                type: "warning",
                text1: "Vui lòng thêm sản phẩm vào giỏ hàng"
            })
            return
        }
        setOpen(true)
    };

    const renderHeader = () => (
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row justify-between py-2">
                <Text className="text-gray-500">Tổng tiền:</Text>
                <Text className="text-gray-800 font-medium">{formatPrice(totalAmount)}đ</Text>
            </View>

            <View className="flex-row justify-between py-2">
                <Text className="text-gray-500">Phí vận chuyển:</Text>
                <Text className="text-gray-800 font-medium">0 đ</Text>
            </View>

            <View className="flex-row justify-between py-3 border-t border-gray-100 mt-2 mb-4">
                <Text className="text-gray-800 font-bold text-base">Thành tiền:</Text>
                <Text className="text-gray-900 font-bold text-lg">{formatPrice(totalAmount)}đ</Text>
            </View>

            <CustomButton
                label='Thanh toán ngay'
                onPress={handleCheckout}
                size="lg"
                icon="arrow-forward"
            />
        </View>
    );

    if (carts.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-10">
                <Feather name="shopping-bag" size={60} color="#ccc" />
                <Text className="text-lg font-semibold text-gray-800 mt-4">
                    Giỏ hàng của bạn đang trống
                </Text>
                <Text className="text-sm text-gray-500 mt-2">
                    Thêm sản phẩm để bắt đầu mua sắm 🛍️
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <CheckoutForm {...{
                open,
                onClose: () => setOpen(false),
                products: carts
            }} />
            <View className="flex-1 p-4">
                <Text className="text-lg font-bold text-gray-800 mb-4">
                    Giỏ hàng của tôi 🛍️
                </Text>
                {/* Sử dụng FlatList với ListHeaderComponent để phần header luôn hiển thị cố định */}
                <FlatList
                    data={carts}
                    keyExtractor={(item, index) => `${item.productId}-${item.size}-${item.color}-${index}`}
                    renderItem={({ item }) => <CartItem item={item} />}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]} // Quan trọng: Làm cho header "dính" ở trên cùng
                />

                {/* Khoảng trống để tránh bị ẩn bởi tab bar */}
                <View className="h-16" />
            </View>
        </SafeAreaView>
    );
};

export default CartList;
