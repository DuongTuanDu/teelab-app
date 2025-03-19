import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useGetFilterOptionsQuery } from "@/redux/product/product.query";
import { formatPrice } from "@/helpers/formatPrice";
import { AntDesign } from '@expo/vector-icons';
import { IFilterCategory } from "@/redux/product/product.interface";

interface FilterOptionProps {
    currentFilters: any;
    onFilterChange: (filters: any) => void;
}

const FilterOption = ({ currentFilters, onFilterChange }: FilterOptionProps) => {
    const { data, isLoading } = useGetFilterOptionsQuery();
    console.log("data", data);


    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-500">Đang tải...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <AntDesign name="inbox" size={48} color="#d1d5db" />
                <Text className="mt-4 text-gray-500">Không có tùy chọn lọc</Text>
            </View>
        );
    }

    const handleFilterChange = (type: string, value: any) => {
        onFilterChange({
            [type]: value,
        });
    };

    // Kiểm tra nếu có bất kỳ bộ lọc nào được áp dụng
    const hasActiveFilters = Object.keys(currentFilters).some((key) =>
        Array.isArray(currentFilters[key])
            ? currentFilters[key].length > 0
            : currentFilters[key] !== null && currentFilters[key] !== ""
    );

    return (
        <View className="p-4 space-y-6 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold">Bộ lọc</Text>
                {hasActiveFilters && (
                    <TouchableOpacity
                        onPress={() =>
                            onFilterChange({
                                categories: [],
                                priceRange: [],
                                rating: "",
                                colors: [],
                            })
                        }
                    >
                        <Text className="text-sm text-blue-500">Xóa tất cả</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Khoảng giá */}
            <View>
                <Text className="font-medium text-base mb-2">Khoảng giá</Text>
                <View className="space-y-3">
                    {data && data.priceRanges && data.priceRanges.map((range: any) => (
                        <TouchableOpacity
                            key={`${range.min}-${range.max}`}
                            onPress={() => handleFilterChange("priceRange", [range.min, range.max])}
                            className={`flex-row items-center justify-between p-3 rounded-lg border ${currentFilters.priceRange?.[0] === range.min
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                                }`}
                        >
                            <Text className="text-sm font-medium">
                                {formatPrice(range.min)} - {formatPrice(range.max)}đ
                            </Text>
                            <View
                                className={`w-4 h-4 rounded-full border-2 ${currentFilters.priceRange?.[0] === range.min
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                    }`}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Đánh giá */}
            <View>
                <Text className="font-medium text-base mb-2">Đánh giá</Text>
                <View className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <TouchableOpacity
                            key={rating}
                            onPress={() => handleFilterChange("rating", rating)}
                            className={`flex-row items-center justify-between p-3 rounded-lg border ${currentFilters.rating === rating
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                                }`}
                        >
                            <View className="flex-row items-center">
                                {[...Array(rating)].map((_, i) => (
                                    <AntDesign
                                        key={i}
                                        name={currentFilters.rating === rating ? "star" : "star"}
                                        size={16}
                                        color={currentFilters.rating === rating ? "#3b82f6" : "#f59e0b"}
                                    />
                                ))}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Danh mục */}
            <View>
                <Text className="font-medium text-base mb-2">Danh mục</Text>
                <View className="space-y-2">
                    {data && data.categories && data.categories.map((category: IFilterCategory) => (
                        <TouchableOpacity
                            key={category._id}
                            onPress={() =>
                                handleFilterChange(
                                    "categories",
                                    currentFilters.categories?.includes(category._id)
                                        ? currentFilters.categories.filter((c: any) => c !== category._id)
                                        : [...(currentFilters.categories || []), category._id]
                                )
                            }
                            className={`flex-row items-center justify-between p-3 rounded-lg border ${currentFilters.categories?.includes(category._id)
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                                }`}
                        >
                            <Text className="text-sm font-medium">{category.name}</Text>
                            <Text className="text-xs text-gray-500">({category.productCount})</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Màu sắc */}
            <View>
                <Text className="font-medium text-base mb-2">Màu sắc</Text>
                <View className="flex-row flex-wrap gap-2">
                    {data && data.colors && data.colors.map((color: any) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() =>
                                handleFilterChange(
                                    "colors",
                                    currentFilters.colors?.includes(color)
                                        ? currentFilters.colors.filter((c: any) => c !== color)
                                        : [...(currentFilters.colors || []), color]
                                )
                            }
                            className={`px-4 py-2 rounded-full border mb-2 mr-2 ${currentFilters.colors?.includes(color)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-200"
                                }`}
                        >
                            <Text
                                className={`text-sm font-medium ${currentFilters.colors?.includes(color) ? "text-white" : "text-gray-800"
                                    }`}
                            >
                                {color}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default FilterOption;