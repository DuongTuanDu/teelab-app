import CustomButton from '@/components/custombutton';
import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';

interface IProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    variantColor?: string;
    loadingUpdate?: boolean;
}

const ConfirmModal = ({
    visible,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    variantColor = 'danger',
    loadingUpdate = false
}: IProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-center items-center"
                onPress={onCancel}
            >
                <View
                    className="mx-5 bg-white rounded-lg p-5 shadow-md w-4/5 max-w-md"
                    onStartShouldSetResponder={() => true}
                    onTouchEnd={e => e.stopPropagation()}
                >
                    <Text className="font-bold text-base mb-2">
                        {title}
                    </Text>

                    <Text className="mb-4 text-gray-700">
                        {message}
                    </Text>

                    <View className="flex-row justify-end gap-2">
                        <CustomButton
                            label={cancelText}
                            onPress={onCancel}
                            size="sm"
                            variant="secondary"
                        />
                        <CustomButton
                            label={confirmText}
                            onPress={onConfirm}
                            size="sm"
                            variant={variantColor}
                            loading={loadingUpdate}
                        />
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

export default ConfirmModal;