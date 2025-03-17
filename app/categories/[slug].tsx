import CategoryBanner from '@/components/CategoryBanner';
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { Animated } from 'react-native';
import FilterOption from './FilterOption';
import ProductList from '@/components/products/product.list';
import { useGetProductsByCategoryQuery } from '@/redux/product/product.query';
import { ICategory } from '@/redux/category/category.interface';
import { useRoute } from '@react-navigation/native';
import { useAppSelector } from '@/hooks/useRedux';

const CategorySlug = () => {
    const route = useRoute();
    const { slug, categoryId } = route.params as {
        slug: string, 
        categoryId: number
    };

    const { categories = [] } = useAppSelector(state => state.category);

    const categoryName = categories.find(category => category.slug === slug)?.name;

    const scrollY = useRef(new Animated.Value(0)).current;

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

    return (
        <Animated.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <CategoryBanner category={{ name: categoryName }} />

            <FilterOption 
                currentFilters={filters} 
                onFilterChange={handleFilterChange} 
            />

            <View className="flex-1 bg-white">
                <Text className="text-lg font-medium px-4">Danh sách sản phẩm</Text>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
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
    )
}

export default CategorySlug