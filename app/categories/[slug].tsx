// import CategoryBanner from '@/components/category-banner'
// import React, { useRef, useState } from 'react'
// import { ActivityIndicator, Text, View } from 'react-native'
// import { Animated } from 'react-native';
// import FilterOption from './filter-option';
// import ProductList from '@/components/products/product.list';
// import { useGetProductsByCategoryQuery } from '@/redux/product/product.query';
// import { ICategory } from '@/redux/category/category.interface';
// import { useRoute } from '@react-navigation/native';
// import { useAppSelector } from '@/hooks/useRedux';

// const CategorySlug = () => {
//     const route = useRoute();
//     const { slug, categoryId } = route.params as {
//         slug: string, 
//         categoryId: number
//     };

//     const { categories = [] } = useAppSelector(state => state.category);

//     const categoryName = categories.find(category => category.slug === slug)?.name;

//     const scrollY = useRef(new Animated.Value(0)).current;

//     const handleScroll = Animated.event(
//         [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//         { useNativeDriver: false }
//     );

//     const [filters, setFilters] = useState({
//         priceRange: [],
//         categories: [],
//         rating: "",
//         colors: [],
//         page: 1,
//         pageSize: 12,
//     });

//     // Create a category object that matches ICategory
//     const category: ICategory = {
//         _id: categoryId,
//         name: categoryName || "",
//         slug: slug,
//         priceRange: filters.priceRange,
//         categories: filters.categories,
//         rating: filters.rating,
//         colors: filters.colors,
//         page: filters.page,
//         pageSize: filters.pageSize
//     };

//     const { data, isLoading, error } = useGetProductsByCategoryQuery(category);

//     const products = data?.products || [];
//     const pagination = data?.pagination || { 
//         page: 1, 
//         pageSize: 12, 
//         totalPage: 1, 
//         totalItems: 0 
//     };

//     const handleFilterChange = (newFilters: any) => {
//         setFilters((prev) => ({
//             ...prev,
//             ...newFilters,
//             page: 1,
//         }));
//     };

//     const handlePageChange = (page: number) => {
//         setFilters((prev) => ({
//             ...prev,
//             page,
//         }));
//     };

//     return (
//         <Animated.ScrollView
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//             contentContainerStyle={{ flexGrow: 1 }}
//         >
//             <CategoryBanner category={{ name: categoryName }} />

//             <FilterOption 
//                 currentFilters={filters} 
//                 onFilterChange={handleFilterChange} 
//             />

//             <View className="flex-1 bg-white">
//                 <Text className="text-lg font-medium px-4">Danh sách sản phẩm</Text>

//                 {isLoading ? (
//                     <View className="flex-1 items-center justify-center">
//                         <ActivityIndicator size="large" color="#3B82F6" />
//                     </View>
//                 ) : products.length > 0 ? (
//                     <ProductList
//                         products={products}
//                         isLoading={isLoading}
//                         isPagination={true}
//                         pagination={pagination}
//                         onPageChange={handlePageChange}
//                     />
//                 ) : (
//                     <View className="flex-1 items-center justify-center p-12">
//                         <Text className="text-gray-500 text-base">
//                             Không tìm thấy sản phẩm phù hợp
//                         </Text>
//                     </View>
//                 )}
//             </View>
//         </Animated.ScrollView>
//     )
// }

// export default CategorySlug

import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text, View, Dimensions, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FilterOption from './filter-option';
import ProductList from '@/components/products/product.list';
import { useGetProductsByCategoryQuery } from '@/redux/product/product.query';
import { ICategory } from '@/redux/category/category.interface';
import { useRoute } from '@react-navigation/native';
import { useAppSelector } from '@/hooks/useRedux';
import CategoryBanner from '@/components/category-banner';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8; // 80% of screen width

const CategorySlug = () => {
    const route = useRoute();
    const { slug, categoryId } = route.params as {
        slug: string, 
        categoryId: number
    };

    const { categories = [] } = useAppSelector(state => state.category);
    const categoryName = categories.find(category => category.slug === slug)?.name;
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

    // Create a category object that matches ICategory
    const category: ICategory = {
        _id: categoryId,
        name: categoryName || "",
        slug: slug,
        priceRange: filters.priceRange,
        categories: filters.categories,
        rating: filters.rating,
        colors: filters.colors,
        page: filters.page,
        pageSize: filters.pageSize
    };

    const { data, isLoading, error } = useGetProductsByCategoryQuery(category);

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
                <CategoryBanner category={{ name: categoryName }} />

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
                                    // Optionally close drawer after applying filter on mobile
                                    // setDrawerVisible(false);
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

export default CategorySlug;