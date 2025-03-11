import Loading from '@/components/loading'
import { useGetProductDetailQuery, useGetProductHomeQuery } from '@/redux/product/product.query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState, useRef } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather, AntDesign } from '@expo/vector-icons'
import Animated, { FadeIn } from 'react-native-reanimated'
import { formatPrice } from '@/helpers/formatPrice'
import RenderHTML from "react-native-render-html";
import ProductList from '@/components/products/product.list'
import ReviewList from './review.list'

const { width } = Dimensions.get('window')

const ProductDetail = () => {
    const { slug } = useLocalSearchParams()
    const router = useRouter()
    const scrollRef = useRef<ScrollView>(null)
    const slugValue = Array.isArray(slug) ? slug[0] : slug;
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState(0)

    const { data, isLoading } = useGetProductDetailQuery(slugValue, {
        skip: !slugValue
    })
    const { data: dataOtherProduct } = useGetProductHomeQuery(data?.data.category.slug || "", {
        skip: !data?.data
    })

    const product = data?.data || null
    const otherProducts = dataOtherProduct?.data || []

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log(`Added ${quantity} of ${product?.name} to cart`)
    }

    const handleBuyNow = () => {

    }

    const renderRatingStars = (rating: number) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <AntDesign
                    key={i}
                    name={i <= rating ? "star" : "staro"}
                    size={16}
                    color="#FFD700"
                />
            )
        }
        return stars
    }

    const increaseQuantity = () => setQuantity(prev => prev + 1)
    const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

    if (isLoading) return <Loading />

    if (!product) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-500">Không tìm thấy sản phẩm</Text>
                <TouchableOpacity
                    className="mt-4 py-2 px-4 bg-blue-500 rounded-lg"
                    onPress={() => router.back()}
                >
                    <Text className="text-white">Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    const displayPrice = product.isPromotion && product.promotion
        ? product.promotion.finalPrice
        : product.price

    const discountPercentage = product.isPromotion && product.promotion
        ? Math.round(100 - (product.promotion.finalPrice * 100 / product.price))
        : 0

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} className="flex-1">
                {/* Product Images */}
                <View>
                    <FlatList
                        data={[product.mainImage, ...(product.variants.map(v => v.image))]}
                        keyExtractor={(_, index) => `image-${index}`}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Animated.View
                                entering={FadeIn}
                                className="w-full justify-center items-center"
                                style={{ width }}
                            >
                                <Image
                                    source={{ uri: item.url }}
                                    style={{ width: "100%", height: width - 40, resizeMode: 'cover' }}
                                />
                            </Animated.View>
                        )}
                    />

                    {/* Variant Color Selection */}
                    {product.variants.length > 0 && (
                        <View className="flex-row justify-center mt-4">
                            {product.variants.map((variant, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className={`w-10 h-10 rounded-full border-2 mx-1 overflow-hidden ${selectedVariant === index + 1 ? 'border-blue-500' : 'border-gray-300'}`}
                                    onPress={() => setSelectedVariant(index + 1)}
                                >
                                    <Image
                                        source={{ uri: variant.image.url }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Product Info */}
                <View className="px-4 py-4">
                    {product.isPromotion && product.promotion && (
                        <View className="flex-row items-center mb-2">
                            <View className="bg-red-500 px-2 py-1 rounded">
                                <Text className="text-white text-xs font-bold">-{discountPercentage}%</Text>
                            </View>
                            <Text className="ml-2 text-red-500 font-medium">{product.promotion.promotionInfo.name}</Text>
                        </View>
                    )}

                    <Text className="text-xl font-bold text-gray-800">{product.name}</Text>

                    <View className="flex-row items-baseline mt-2">
                        <Text className="text-xl font-bold text-red-500">
                            {formatPrice(displayPrice)}đ
                        </Text>
                        {product.isPromotion && product.promotion && (
                            <Text className="ml-2 text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}đ
                            </Text>
                        )}
                    </View>

                    <View className="flex-row items-center mt-2">
                        <View className="flex-row">
                            {renderRatingStars(product.averageRating)}
                        </View>
                        <Text className="ml-2 text-gray-600">({product.totalReviews} đánh giá)</Text>
                    </View>

                    {/* Category */}
                    <TouchableOpacity
                        className="mt-2 flex-row items-center"
                        onPress={() => router.push(`/categories/${product.category.slug}`)}
                    >
                        <Text className="text-gray-600">Danh mục: </Text>
                        <Text className="text-blue-500">{product.category.name}</Text>
                    </TouchableOpacity>

                    {/* Quantity Selector */}
                    <View className="flex-row items-center mt-4">
                        <Text className="text-gray-700 font-medium mr-4">Số lượng:</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-lg overflow-hidden">
                            <TouchableOpacity
                                className="w-10 h-10 items-center justify-center bg-gray-100"
                                onPress={decreaseQuantity}
                            >
                                <AntDesign name="minus" size={18} color={quantity > 1 ? "#333" : "#ccc"} />
                            </TouchableOpacity>
                            <View className="w-10 h-10 items-center justify-center">
                                <Text className="text-gray-800 font-medium">{quantity}</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 items-center justify-center bg-gray-100"
                                onPress={increaseQuantity}
                            >
                                <AntDesign name="plus" size={18} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View className="px-4 py-4 border-t border-gray-100">
                    <Text className="text-lg font-bold text-gray-800 mb-2">Mô tả sản phẩm</Text>
                    <RenderHTML contentWidth={width} source={{ html: product.description }} />
                </View>

                {/* Reviews */}
                <View className="px-4 py-4 border-t border-gray-100 space-y-2">
                    <Text className="text-lg font-bold text-gray-800">Đánh giá & Nhận xét</Text>
                    <ReviewList slug={product.slug} />
                    {/* {product.totalReviews > 0 ? (
                        <View className="bg-gray-50 p-3 rounded-lg">
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                />
                                <View className="ml-2">
                                    <Text className="font-medium text-gray-800">Khách hàng</Text>
                                    <View className="flex-row mt-1">
                                        {renderRatingStars(5)}
                                    </View>
                                </View>
                                <Text className="ml-auto text-gray-500 text-xs">2 ngày trước</Text>
                            </View>
                            <Text className="mt-2 text-gray-600">
                                Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh chóng!
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-gray-50 p-4 rounded-lg items-center">
                            <Text className="text-gray-500">Chưa có đánh giá nào</Text>
                        </View>
                    )} */}
                </View>

                {/* Related Products */}
                {
                    otherProducts.length > 0 && (
                        <View className="border-t border-gray-100 mb-4">
                            <ProductList {...{
                                products: otherProducts.map((item) => item.products).flat(),
                                title: "Sản phẩm tương tự",
                                layout: "horizontal"
                            }} />
                        </View>
                    )
                }

            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="flex-row px-4 py-3 border-t border-gray-200">
                <TouchableOpacity className="w-12 h-12 items-center justify-center border border-gray-300 rounded-lg mr-3">
                    <Feather name="shopping-bag" size={22} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 items-center justify-center bg-blue-100 rounded-lg mr-2"
                    onPress={handleAddToCart}
                >
                    <Text className="font-bold text-blue-600">Thêm vào giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 items-center justify-center bg-blue-600 rounded-lg"
                    onPress={handleBuyNow}
                >
                    <Text className="font-bold text-white">Mua ngay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ProductDetail
