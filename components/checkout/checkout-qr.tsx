import React, { useState } from 'react';
import {
    Image,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IProps {
    qrcode: string;
}

const CheckoutQr = ({ qrcode }: IProps) => {
    const [loading, setLoading] = useState(true);

    return (
        <View className="rounded-2xl p-5 items-center shadow-md">
            {/* Header */}
            <View className="w-full flex-row justify-center items-center mb-5 relative">
                <Text className="text-xl font-bold text-gray-800">Mã QR Thanh Toán</Text>
            </View>

            {/* QR Code Container */}
            <View className="w-4/5 aspect-square justify-center items-center bg-white rounded-xl p-4 mb-4 border border-gray-200">
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#007AFF"
                        className="absolute"
                    />
                )}
                {
                    qrcode && <Image
                        source={{ uri: qrcode }}
                        className="w-full h-full"
                        resizeMode="contain"
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                    />
                }
            </View>

            {/* Instruction */}
            <View className="flex-row items-center justify-center mb-3 px-3 py-2 bg-blue-50 rounded-lg w-full">
                <Ionicons name="scan-outline" size={22} color="#007AFF" />
                <Text className="text-xs text-gray-800 ml-2">
                    Quét mã QR bằng ứng dụng ngân hàng của bạn
                </Text>
            </View>
        </View>
    );
};

export default CheckoutQr;