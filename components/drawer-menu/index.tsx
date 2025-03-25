import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RelativePathString, useRouter } from 'expo-router';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from '@/redux/auth/auth.slice';

export interface ICategory {
    _id: number;
    name: string;
    slug: string;
}

interface IProps {
    open: boolean;
    onClose: () => void;
}

const DrawerMenu = ({ open, onClose }: IProps) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const { carts = [] } = useAppSelector(state => state.cart);
    const { categories = [] } = useAppSelector(state => state.category);
    const router = useRouter();

    const handleNavigation = (path: string) => {
        if (path === "/account" && !isAuthenticated) {
            router.push("/login");
        } else {
            router.push(path as RelativePathString);
        }
        onClose();
    };

    const handleLogout = () => {
        dispatch(logout());
        onClose();
        router.push('/');
    };

    // Sử dụng Modal thay vì DrawerLayoutAndroid
    return (
        <Modal
            visible={open}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 flex-row">
                {/* Overlay to close drawer */}
                <Pressable
                    onPress={onClose}
                    className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-50"
                />

                {/* Drawer content */}
                <View className="bg-white w-[280px] h-full">
                    <View className="flex-row items-center justify-between px-6 pb-4 border-b border-gray-100">
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{ height: 50, width: 120 }}
                        />
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Main Menu Items */}
                        <View className="px-4">
                            <TouchableOpacity
                                className="flex-row items-center py-4 px-2 border-b border-gray-100"
                                onPress={() => handleNavigation('/')}
                            >
                                <Feather name="home" size={22} color="#333" />
                                <Text className="ml-3 text-lg font-medium text-gray-800">Trang chủ</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center py-4 px-2 border-b border-gray-100"
                                onPress={() => handleNavigation('/account')}
                            >
                                <Feather name="settings" size={22} color="#333" />
                                <Text className="ml-3 text-lg font-medium text-gray-800">Tài khoản</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center py-4 px-2 border-b border-gray-100"
                                onPress={() => handleNavigation('/promotions')}
                            >
                                <Feather name="gift" size={22} color="#333" />
                                <Text className="ml-3 text-lg font-medium text-gray-800">Khuyến mãi</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center py-4 px-2 border-b border-gray-100"
                                onPress={() => handleNavigation('/cart')}
                            >
                                <Feather name="shopping-bag" size={22} color="#333" />
                                <Text className="ml-3 text-lg font-medium text-gray-800">Giỏ hàng</Text>
                                <View className="ml-auto bg-red-500 rounded-full h-6 w-6 flex items-center justify-center">
                                    <Text className="text-white text-xs font-bold">{carts.length}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Simple Category List */}
                        <View className="mt-4 px-4">
                            <Text className="text-lg font-bold text-gray-800 mb-2 px-2">Danh mục sản phẩm</Text>
                            {categories && categories.length > 0 ? (
                                categories.map((category: ICategory) => (
                                    <TouchableOpacity
                                        key={category._id}
                                        className="flex-row items-center py-3 px-2 border-b border-gray-100"
                                        onPress={() => handleNavigation(`/categories/${category.slug}`)}
                                    >
                                        <MaterialCommunityIcons name="tag-outline" size={20} color="#555" />
                                        <Text className="ml-3 text-base text-gray-700">{category.name}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View className="py-4 px-2">
                                    <Text className="text-gray-500 italic">Không có danh mục nào</Text>
                                </View>
                            )}
                        </View>

                        {/* Additional Menu Items */}
                        {isAuthenticated && (
                            <View className="mt-6 px-4 pb-8">
                                <TouchableOpacity
                                    className="flex-row items-center py-3 px-2 border-b border-gray-100"
                                    onPress={() => handleNavigation('/orders')}
                                >
                                    <Feather name="package" size={22} color="#333" />
                                    <Text className="ml-3 text-base text-gray-800">Đơn hàng của tôi</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleLogout}
                                    className="flex-row items-center py-3 px-2 mt-4 bg-gray-100 rounded-lg"
                                >
                                    <Feather name="log-out" size={22} color="#f43f5e" />
                                    <Text className="ml-3 text-base font-medium text-red-500">Đăng xuất</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default DrawerMenu;