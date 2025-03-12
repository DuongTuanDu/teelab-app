import { formatPrice } from '@/helpers/formatPrice';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ICart } from '@/redux/cart/cart.interface';
import { CartActions } from '@/redux/cart/cart.slice';
import { EvilIcons } from '@expo/vector-icons';
import React from 'react'
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { View } from 'react-native';

const CartItem = ({ item }: { item: ICart }) => {
    const dispatch = useAppDispatch();
    const { carts } = useAppSelector(state => state.cart);

    const handleIncrement = () => {
        dispatch(CartActions.addToCart(item));
        dispatch(CartActions.saveCartToStorage(carts));
    };

    const handleDecrement = () => {
        dispatch(CartActions.decrementQuantity(item));
        dispatch(CartActions.saveCartToStorage(carts));
    };

    const handleRemove = () => {
        dispatch(CartActions.removeFromCart(item));
        dispatch(CartActions.saveCartToStorage(carts));
    };

    return (
        <View className="flex-row bg-white rounded-xl p-3 mb-3 shadow-sm">
            <Image
                source={{ uri: item.image }}
                className="w-20 h-20 rounded-lg mr-3"
            />

            <View className="flex-1 justify-between space-y-1">
                <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
                    {item.name}
                </Text>

                <View className="flex-row flex-wrap">
                    {item.size && (
                        <View className="bg-gray-100 rounded px-2 py-1 mr-2 mb-1">
                            <Text className="text-xs text-gray-600">Size: {item.size}</Text>
                        </View>
                    )}

                    {item.color && (
                        <View className="bg-gray-100 rounded px-2 py-1 mr-2 mb-1">
                            <Text className="text-xs text-gray-600">Color: {item.color}</Text>
                        </View>
                    )}
                </View>

                <Text className="text-base font-bold text-gray-800">
                    {formatPrice(item.price)}đ
                </Text>

                <View className="flex-row items-center">
                    <TouchableOpacity
                        className="bg-gray-100 w-7 h-7 rounded-md items-center justify-center"
                        onPress={handleDecrement}
                    >
                        <EvilIcons name="minus" size={16} color="#333" />
                    </TouchableOpacity>

                    <Text className="mx-3 font-semibold min-w-5 text-center">
                        {item.quantity}
                    </Text>

                    <TouchableOpacity
                        className="bg-gray-100 w-7 h-7 rounded-md items-center justify-center"
                        onPress={handleIncrement}
                    >
                        <EvilIcons name="plus" size={16} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                className="p-2 justify-center"
                onPress={handleRemove}
            >
                <EvilIcons name="trash" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem
