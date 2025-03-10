import React from 'react';
import { View, ActivityIndicator, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Loading = () => {
    return (
        <View className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ width: width, height: height }}>
            <View className="absolute inset-0 bg-black opacity-70" />
            <View className="bg-white px-8 py-6 rounded-2xl items-center z-10 shadow-lg">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-800 font-semibold text-base">Loading...</Text>
            </View>
        </View>
    );
};

export default Loading;