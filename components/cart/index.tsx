import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Feather } from '@expo/vector-icons';
import CartItem from './cart.item';
import { formatPrice } from '@/helpers/formatPrice';

const CartList = () => {
    const dispatch = useAppDispatch();
    const { carts, totalAmount } = useAppSelector(state => state.cart);

    const handleCheckout = () => {

    };

    const renderHeader = () => (
        <View>
            {/* Phần tổng tiền và thanh toán - luôn cố định ở đầu */}
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

                <TouchableOpacity
                    className="bg-blue-600 rounded-xl flex-row justify-center items-center py-4"
                    onPress={handleCheckout}
                >
                    <Text className="text-white font-semibold text-base mr-2">
                        Thanh toán ngay
                    </Text>
                    <Feather name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
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
