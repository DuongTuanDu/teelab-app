import { formatPrice } from '@/helpers/formatPrice';
import { IProduct } from '@/redux/product/product.interface'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react'
import { Dimensions, Image, Text } from 'react-native';
import { TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const product_WIDTH = width / 2 - 24;

const ProductItem = ({ product }: { product: IProduct }) => {
    const router = useRouter()
    const hasPromotion = product.isPromotion && product.promotion !== null;
    const displayPrice = hasPromotion && product.promotion !== null ? product.promotion.finalPrice : product.price;

    const calculateDiscount = (originalPrice: number, finalPrice: number) => {
        return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    };
    return (
        <TouchableOpacity
            className="mb-4 rounded-xl overflow-hidden bg-white"
            style={{ width: product_WIDTH }}
            onPress={() => router.push(`/products/${product.slug}`)}
            activeOpacity={0.7}
        >
            <View className="relative">
                {/* Product Image */}
                <Image
                    source={{ uri: product.mainImage.url }}
                    className="w-full h-40 rounded-xl"
                    resizeMode="cover"
                />

                {/* Promotion Badge */}
                {hasPromotion && (
                    <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">
                            -{calculateDiscount(product.price, product.promotion?.finalPrice ?? 0)}%
                        </Text>
                    </View>
                )}

                {/* Wishlist Button */}
                {/* <TouchableOpacity className="absolute top-2 right-2 bg-white rounded-full p-1.5">
            <FontAwesome name="heart-o" size={16} color="#374151" />
        </TouchableOpacity> */}
            </View>

            <View className="p-3">
                {/* Category */}
                <Text className="text-xs text-gray-500 mb-1">
                    {product.category.name}
                </Text>

                {/* Product Name */}
                <Link href={`/products/${product.slug}`} className="text-sm font-medium text-gray-800 mb-1" numberOfLines={2}>
                    {product.name}
                </Link>

                {/* Rating */}
                <View className="flex-row products-center mb-2">
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text className="text-xs text-gray-700 ml-1">
                        {product.averageRating.toFixed(1)} ({product.totalReviews})
                    </Text>
                </View>

                {/* Price */}
                <View className="flex-row products-center">
                    <Text className="text-base font-bold text-gray-900">
                        {formatPrice(displayPrice)}đ
                    </Text>

                    {hasPromotion && (
                        <Text className="text-xs text-gray-500 line-through ml-2">
                            {formatPrice(product.price)}đ
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProductItem