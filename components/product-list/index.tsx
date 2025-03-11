import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { IProduct } from '@/redux/product/product.interface';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { formatPrice } from '@/helpers/formatPrice';
import { Link } from 'expo-router';
import { useRouter } from "expo-router";

interface IProps {
    products: IProduct[];
    title: string;
    pagination?: {
        page: number;
        pageSize: number;
        totalPage: number;
        totalItems: number;
    }
    isPagination?: boolean;
    isLoading: boolean;
    onPageChange?: (page: number) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 24; // Two columns with padding

const ProductList = (props: IProps) => {
    const {
        products,
        title,
        pagination,
        isPagination = false,
        isLoading,
        onPageChange,
    } = props;
    const router = useRouter();
    // Calculate discount percentage
    const calculateDiscount = (originalPrice: number, finalPrice: number) => {
        return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    };

    // Render each product item
    const renderItem = ({ item }: { item: IProduct }) => {
        const hasPromotion = item.isPromotion && item.promotion !== null;
        const displayPrice = hasPromotion && item.promotion !== null ? item.promotion.finalPrice : item.price;

        return (
            <TouchableOpacity
                className="mb-4 rounded-xl overflow-hidden bg-white"
                style={{ width: ITEM_WIDTH }}
                onPress={() => router.push(`/products/${item.slug}`)}
                activeOpacity={0.7}
            >
                <View className="relative">
                    {/* Product Image */}
                    <Image
                        source={{ uri: item.mainImage.url }}
                        className="w-full h-40 rounded-xl"
                        resizeMode="cover"
                    />

                    {/* Promotion Badge */}
                    {hasPromotion && (
                        <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full">
                            <Text className="text-white text-xs font-bold">
                                -{calculateDiscount(item.price, item.promotion?.finalPrice ?? 0)}%
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
                        {item.category.name}
                    </Text>

                    {/* Product Name */}
                    <Link href={`/products/${item.slug}`} className="text-sm font-medium text-gray-800 mb-1" numberOfLines={2}>
                        {item.name}
                    </Link>

                    {/* Rating */}
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text className="text-xs text-gray-700 ml-1">
                            {item.averageRating.toFixed(1)} ({item.totalReviews})
                        </Text>
                    </View>

                    {/* Price */}
                    <View className="flex-row items-center">
                        <Text className="text-base font-bold text-gray-900">
                            {formatPrice(displayPrice)}đ
                        </Text>

                        {hasPromotion && (
                            <Text className="text-xs text-gray-500 line-through ml-2">
                                {formatPrice(item.price)}đ
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Render pagination controls
    const renderPagination = () => {
        if (!isPagination || !pagination || pagination.totalPage <= 1) return null;

        const { page, totalPage } = pagination;
        const maxButtons = 5;
        const startPage = Math.max(1, Math.min(page - Math.floor(maxButtons / 2), totalPage - maxButtons + 1));
        const endPage = Math.min(totalPage, startPage + maxButtons - 1);

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <View className="flex-row justify-center items-center mt-4 mb-6">
                {/* Previous Button */}
                <TouchableOpacity
                    className={`h-8 w-8 rounded-full items-center justify-center mr-1 ${page === 1 ? 'opacity-50' : ''}`}
                    onPress={() => page > 1 && onPageChange && onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    <Ionicons name="chevron-back" size={16} color="#374151" />
                </TouchableOpacity>

                {/* Page Numbers */}
                {pageNumbers.map((pageNum) => (
                    <TouchableOpacity
                        key={`page-${pageNum}`}
                        className={`h-8 w-8 rounded-full items-center justify-center mx-1 ${pageNum === page ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                        onPress={() => onPageChange && onPageChange(pageNum)}
                    >
                        <Text
                            className={`text-sm font-medium ${pageNum === page ? 'text-white' : 'text-gray-700'
                                }`}
                        >
                            {pageNum}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* Next Button */}
                <TouchableOpacity
                    className={`h-8 w-8 rounded-full items-center justify-center ml-1 ${page === totalPage ? 'opacity-50' : ''}`}
                    onPress={() => page < totalPage && onPageChange && onPageChange(page + 1)}
                    disabled={page === totalPage}
                >
                    <Ionicons name="chevron-forward" size={16} color="#374151" />
                </TouchableOpacity>
            </View>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <View className="py-8 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-4">Loading...</Text>
            </View>
        );
    }

    // Empty state
    if (products.length === 0 && !isLoading) {
        return (
            <View className="py-16 items-center justify-center">
                <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-400 text-base mt-4">Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    return (
        <View className="px-4">
            {/* Section Title and Results Count */}
            <View className="flex-row justify-between items-center py-4">
                <Text className="text-lg font-bold text-gray-800">{title}</Text>
                <Text className="text-sm text-gray-500">
                    {pagination ? `${pagination.totalItems} sản phẩm` : `${products.length} sản phẩm`}
                </Text>
            </View>

            {/* Products Grid */}
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListFooterComponent={renderPagination}
            />
        </View>
    );
};

export default ProductList;