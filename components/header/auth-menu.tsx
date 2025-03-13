import { EvilIcons, Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { RelativePathString } from 'expo-router';


const AuthMenu = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = () => {
        if (isOpen) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        setIsOpen(false);
    };

    return (
        <View className="relative">
            <TouchableOpacity
                onPress={toggleDropdown}
                className="p-1"
            >
                {!isAuthenticated ? (
                    <EvilIcons name="user" size={40} color="#374151" />
                ) : (
                    <Image
                        source={{ uri: "https://avatar.iran.liara.run/public" }}
                        className="h-10 w-10 rounded-full"
                    />
                )}
            </TouchableOpacity>

            {/* Modal dropdown */}
            <Modal
                transparent={true}
                visible={isOpen}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    className="flex-1"
                    onPress={handleOutsideClick}
                >
                    <View className="flex-1 bg-black/30">
                        <View className="absolute right-4 top-16 bg-white rounded-xl shadow-lg w-48 overflow-hidden">
                            {!isAuthenticated ? (
                                <>
                                    <TouchableOpacity
                                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                                        onPress={() => router.push('/login')}
                                    >
                                        <Feather name="log-in" size={18} color="#4b4b4bc" />
                                        <Text className="text-gray-800 font-medium ml-2">Đăng nhập</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-row items-center px-4 py-3"
                                        onPress={() => router.push('/register')}
                                    >
                                        <Feather name="user-plus" size={18} color="#4b4b4b" />
                                        <Text className="text-gray-800 font-medium ml-2">Đăng ký</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                                        onPress={() => router.push('/account')}
                                    >
                                        <Feather name="user" size={18} color="#4b4b4b" />
                                        <Text className="text-gray-800 font-medium ml-2">Tài khoản</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                                        onPress={() => router.push('/orders' as RelativePathString)}
                                    >
                                        <Feather name="shopping-bag" size={18} color="#4b4b4b" />
                                        <Text className="text-gray-800 font-medium ml-2">Đơn hàng</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-row items-center px-4 py-3"
                                        onPress={handleLogout}
                                    >
                                        <Feather name="log-out" size={18} color="#EF4444" />
                                        <Text className="text-red-500 font-medium ml-2">Đăng xuất</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default AuthMenu