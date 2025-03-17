import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { ICategory } from '@/redux/category/category.interface';

interface CategoryBannerProps {
  category?: Partial<ICategory>;
  onScroll?: Animated.Value;
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ 
  category = {},
  onScroll
}) => {
  // Tạo animated values cho các hiệu ứng
  const scrollY = onScroll || useRef(new Animated.Value(0)).current;
  
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -30],
    extrapolate: 'clamp'
  });

  const dividerTranslateY = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -40],
    extrapolate: 'clamp'
  });

  const subtitleTranslateY = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -50],
    extrapolate: 'clamp'
  });

  return (
    <View className="bg-white py-8">
      <View className="px-4">
        {/* Tiêu đề */}
        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }]
          }}
        >
          <Text className="text-[28px] text-center font-bold text-[#1a2b4d] tracking-wide">
            {category.name?.toUpperCase() || "ÁO KHOÁC"}
          </Text>
        </Animated.View>

        {/* Divider với gradient */}
        <View className='flex items-center justify-center mt-6 mb-4'>
          <View className="w-24 h-[2px] bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200" />
        </View>

        {/* Dòng mô tả với text có màu gradient */}
        <Animated.View
          style={{
            transform: [{ translateY: subtitleTranslateY }]
          }}
        >
          <Text className="text-center text-base">
            <Text className="text-gray-500">Khám phá các thiết kế độc đáo và phong cách mới nhất</Text>
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default CategoryBanner;