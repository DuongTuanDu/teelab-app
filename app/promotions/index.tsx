import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text, View, Dimensions, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProductList from '@/components/products/product.list';
import { useGetProductsByPromotionQuery } from '@/redux/product/product.query';
import { useAppSelector } from '@/hooks/useRedux';
import FilterOption from '../categories/filter-option';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

interface PromotionBannerProps {
    sale: number | null; // Add this line to define the type of the sale prop
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({ sale }) => {
    return (
        <View className="h-[300px] mx-4 rounded-xl overflow-hidden bg-indigo-50 relative">
            {/* Content */}
            <View className="h-full justify-center items-center p-4 z-10">
                <Text className="text-2xl font-bold text-center text-violet-600 mb-2">
                    Teelab đem đến khuyến mãi siêu hot
                </Text>
                <Text className="text-xl font-bold text-indigo-600 mb-4">
                    🔥 Hãy đặt hàng ngay!
                </Text>
                <Text className="text-base text-gray-700 mb-4">
                    Thời trang cho Gen Z
                </Text>

                {sale && (
                    <View className="flex-row items-center bg-white/90 px-4 py-2.5 rounded-full shadow-sm">
                        <Feather name="tag" size={18} color="#6d28d9" />
                        <Text className="ml-2 text-base font-bold text-violet-600">
                            Giảm đến {sale}%
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const Promotions = () => {

    const { categories = [] } = useAppSelector(state => state.category);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const [filters, setFilters] = useState({
        priceRange: [],
        categories: [],
        rating: "",
        colors: [],
        page: 1,
        pageSize: 12,
    });

    const { data, isLoading, error } = useGetProductsByPromotionQuery({ ...filters });

    const products = data?.products || [];
    const pagination = data?.pagination || {
        page: 1,
        pageSize: 12,
        totalPage: 1,
        totalItems: 0
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
    };

    // Toggle drawer visibility
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const sale = data?.products?.find(
        (item) => item.promotion && item.promotion.promotionInfo.type === "PERCENTAGE"
      )?.promotion?.promotionInfo?.value || null;

    return (
        <View className="flex-1 bg-white">
            {/* Filter Button */}
            <View className="absolute top-4 left-4 z-10 rounded-full bg-white shadow-md">
                <TouchableOpacity
                    onPress={toggleDrawer}
                    className="p-3 rounded-full"
                >
                    <Feather name="filter" size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <PromotionBanner sale={sale} />

                <View className="flex-1 bg-white">
                    <View className="flex-row justify-between items-center px-4 py-3">
                        <Text className="text-lg font-medium">Danh sách sản phẩm</Text>
                        <Text className="text-sm text-gray-500">
                            {pagination.totalItems} sản phẩm
                        </Text>
                    </View>

                    {isLoading ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <ActivityIndicator size="large" color="#3B82F6" />
                        </View>
                    ) : products.length > 0 ? (
                        <ProductList
                            products={products}
                            isLoading={isLoading}
                            isPagination={true}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center p-12">
                            <Text className="text-gray-500 text-base">
                                Không tìm thấy sản phẩm phù hợp
                            </Text>
                        </View>
                    )}
                </View>
            </Animated.ScrollView>

            {/* Filter Drawer */}
            <Modal
                visible={drawerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={toggleDrawer}
            >
                <View className="flex-1 flex-row">
                    {/* Backdrop - touch to close drawer */}
                    <Pressable
                        className="flex-1 bg-black/40"
                        onPress={toggleDrawer}
                    />

                    {/* Drawer Content */}
                    <View className="bg-white" style={{ width: DRAWER_WIDTH }}>
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <Text className="text-xl font-bold">Bộ lọc</Text>
                            <TouchableOpacity onPress={toggleDrawer}>
                                <Feather name="x" size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1">
                            <FilterOption
                                currentFilters={filters}
                                onFilterChange={(newFilters) => {
                                    handleFilterChange(newFilters);
                                }}
                            />
                        </ScrollView>

                        {/* Apply Filters Button */}
                        <View className="p-4 border-t border-gray-200">
                            <TouchableOpacity
                                className="bg-blue-500 py-3 rounded-lg items-center"
                                onPress={toggleDrawer}
                            >
                                <Text className="text-white font-medium">Áp dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Promotions;