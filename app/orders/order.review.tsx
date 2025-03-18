import React, { useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Image, ScrollView, Platform } from 'react-native';
import CustomButton from "@/components/custombutton";
import { Feather, AntDesign } from "@expo/vector-icons";

interface IReviewImage {
  file: File;
  previewUrl: string;
}

interface IProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        rate: number;
        comment: string;
        images: File[];
    }) => void;
    productName: string;
    productImage: string;
    loading?: boolean;
}

const ReviewModal = ({
    visible,
    onClose,
    onSubmit,
    productName,
    productImage,
    loading = false
}: IProps) => {    
    const [rate, setRate] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewImages, setReviewImages] = useState<IReviewImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePickImage = () => {
        if (Platform.OS === 'web' && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);
            
            // Kiểm tra giới hạn số lượng ảnh
            if (reviewImages.length < 5) {
                setReviewImages([...reviewImages, { file, previewUrl }]);
            }
            
            // Reset file input để có thể chọn cùng một file nhiều lần
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        // Revoke URL để tránh rò rỉ bộ nhớ
        URL.revokeObjectURL(reviewImages[indexToRemove].previewUrl);
        setReviewImages(reviewImages.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        // Chỉ gửi file, không gửi URL
        const fileImages = reviewImages.map(img => img.file);
        onSubmit({
            rate,
            comment,
            images: fileImages
        });
    };

    const handleClose = () => {
        // Dọn dẹp URLs khi đóng modal để tránh rò rỉ bộ nhớ
        reviewImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        
        // Đặt lại state khi đóng modal
        setRate(5);
        setComment('');
        setReviewImages([]);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-2xl max-h-[80%]">
                    {/* Header */}
                    <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-gray-800">Đánh giá sản phẩm</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Feather name="x" size={24} color="#4B5563" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="p-4">
                        {/* Product info */}
                        <View className="flex-row mb-4">
                            <Image
                                source={{ uri: productImage }}
                                className="w-16 h-16 rounded-md bg-gray-100"
                            />
                            <View className="ml-3 flex-1 justify-center">
                                <Text className="font-medium text-gray-800" numberOfLines={2}>{productName}</Text>
                            </View>
                        </View>

                        {/* Rating */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-600 mb-2">Đánh giá của bạn</Text>
                            <View className="flex-row">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => setRate(star)}
                                        className="mr-2"
                                    >
                                        <AntDesign
                                            name={star <= rate ? "star" : "staro"}
                                            size={30}
                                            color={star <= rate ? "#FBBF24" : "#9CA3AF"}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Comment */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-600 mb-2">Nhận xét của bạn</Text>
                            <TextInput
                                multiline
                                numberOfLines={4}
                                value={comment}
                                onChangeText={setComment}
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                className="border border-gray-300 rounded-lg p-3 text-gray-700 min-h-[100px]"
                            />
                        </View>

                        {/* Image Upload */}
                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-sm text-gray-600">Thêm hình ảnh (tối đa 5 ảnh)</Text>
                                <Text className="text-xs text-gray-500">{reviewImages.length}/5</Text>
                            </View>

                            {/* Image Grid */}
                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {reviewImages.map((image, index) => (
                                    <View key={index} className="relative w-[31%] aspect-square">
                                        <Image
                                            source={{ uri: image.previewUrl }}
                                            className="w-full h-full rounded-md"
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                                        >
                                            <Feather name="x" size={16} color="white" />
                                        </TouchableOpacity>
                                        <Text className="text-xs text-gray-500 truncate mt-1" numberOfLines={1}>
                                            {image.file.name}
                                        </Text>
                                    </View>
                                ))}
                                
                                {/* Add Image Button (hide if 5 images are uploaded) */}
                                {reviewImages.length < 5 && (
                                    <TouchableOpacity
                                        onPress={handlePickImage}
                                        className="border-2 border-dashed border-gray-300 rounded-md w-[31%] aspect-square flex justify-center items-center"
                                    >
                                        <Feather name="plus" size={24} color="#9CA3AF" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Hidden file input for web */}
                            {Platform.OS === 'web' && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            )}
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View className="p-4 border-t border-gray-200">
                        <CustomButton
                            label="Gửi đánh giá"
                            onPress={handleSubmit}
                            variant="dark"
                            loading={loading}
                            disabled={!comment.trim() || loading}
                            size='lg'
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReviewModal;