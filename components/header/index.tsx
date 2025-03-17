import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, View } from 'react-native'
import { useGetAllCategoryQuery } from '@/redux/category/category.query'
import { CategoryActions } from '@/redux/category/category.slice'
import Loading from '../loading'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import DrawerMenu from '../drawer-menu'
import { useRouter } from 'expo-router'
import { useSegments } from 'expo-router'
import AuthMenu from './auth-menu'
import { TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native'
import { useGetProductSearchQuery } from '@/redux/product/product.query'
import { IProduct } from '@/redux/product/product.interface'
import { Text } from 'react-native'
import { formatPrice } from '@/helpers/formatPrice'
import { ScrollView } from 'react-native'

interface IProps {
    isShowSearch?: boolean
}
const Header = ({ isShowSearch = true }: IProps) => {
    const [searchText, setSearchText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const segments = useSegments() as string[];
    const isAuthScreen = segments.includes("login")
        || segments.includes("register")
        || segments.includes("forgot-password")
        || segments.includes("verify")
        || segments.includes("reset-password");
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const { isAuthenticated } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const { data, isLoading } = useGetAllCategoryQuery()

    const { data: searchData, isLoading: isSearching } = useGetProductSearchQuery(
        searchQuery,
        { skip: !searchQuery || !searchVisible }
    );

    const searchResults = searchData?.data || [];

    useEffect(() => {
        if (data?.data) {
            dispatch(CategoryActions.setCategories(data.data))
        }
    }, [data?.data])

    if (isLoading) return <Loading />

    const handleSearchInputChange = (text: string) => {
        setSearchText(text);
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            setSearchQuery(searchText.trim());
            setSearchVisible(true);
        }
    };

    // Navigate to product detail and close search
    const handleProductSelect = (product: IProduct) => {
        setSearchVisible(false);
        setSearchText('');
        setSearchQuery('');
        router.push(`/products/${product.slug}`);
    };

    // Render a product item in search results
    const renderSearchItem = ({ item }: { item: IProduct }) => (
        <TouchableOpacity
            onPress={() => handleProductSelect(item)}
            className="flex-row items-center p-3 border-b border-gray-100"
        >
            <Image
                source={{ uri: item.mainImage.url }}
                className="w-16 h-16 rounded-md bg-gray-100"
                resizeMode="cover"
            />
            <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium" numberOfLines={2}>
                    {item.name}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-blue-600 font-bold">
                        {formatPrice(item.isPromotion && item.promotion ? item.promotion.finalPrice : item.price)}đ
                    </Text>
                    {item.isPromotion && item.promotion && (
                        <Text className="text-gray-400 text-xs line-through ml-2">
                            {formatPrice(item.price)}đ
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <DrawerMenu
                {...{
                    open: openMenu,
                    onClose: () => setOpenMenu(false)
                }}
            />
            <View className="px-4 pt-4 pb-2 bg-white w-full flex-row flex items-center justify-between gap-4">
                <Ionicons onPress={() => setOpenMenu(true)} name="menu" size={24} color="black" />
                <TouchableOpacity onPress={() => router.push("/")}>
                    <Image source={require("../../assets/images/logo.png")} style={{ height: 50, width: 150 }} />
                </TouchableOpacity>
                <AuthMenu
                    isAuthenticated={isAuthenticated}
                />
            </View>
            {isShowSearch && !isAuthScreen && (
                <View className="px-6 pb-4">
                    <View className="flex-row items-center bg-slate-50 rounded-full px-4">
                        <TextInput
                            className="flex-1 py-2 px-2 text-gray-800"
                            placeholder="Tìm kiếm sản phẩm..."
                            placeholderTextColor="#9ca3af"
                            value={searchText}
                            onChangeText={handleSearchInputChange}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity className="p-2" onPress={handleSearch}>
                            <Ionicons name="search" size={24} color="#5b636a" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Search Results Modal */}
            {searchVisible && searchText.length > 0 && (
                <Modal
                    visible={true}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSearchVisible(false)}
                >
                    <Pressable
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                        onPress={() => setSearchVisible(false)}
                    >
                        <Pressable
                            style={{
                                marginTop: 112,
                                marginHorizontal: 16,
                                backgroundColor: 'white',
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                                maxHeight: '70%',
                                overflow: 'hidden'
                            }}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                                <Text className="text-lg font-bold">Kết quả tìm kiếm</Text>
                                <TouchableOpacity onPress={() => setSearchVisible(false)}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            {isSearching ? (
                                <View className="p-4 items-center">
                                    <ActivityIndicator size="large" color="#4f637e" />
                                    <Text className="mt-2 text-gray-500">Đang tìm kiếm...</Text>
                                </View>
                            ) : searchResults.length > 0 ? (
                                <ScrollView showsVerticalScrollIndicator={true} className="max-h-96">
                                    {searchResults.map((item, index) => (
                                        <TouchableOpacity
                                            key={`search-item-${index}`}
                                            onPress={() => handleProductSelect(item)}
                                            className="flex-row items-center p-3 border-b border-gray-100"
                                        >
                                            <Image
                                                source={{ uri: item.mainImage.url }}
                                                className="w-16 h-16 rounded-md bg-gray-100"
                                                resizeMode="cover"
                                            />
                                            <View className="ml-3 flex-1">
                                                <Text className="text-gray-800 font-medium" numberOfLines={2}>
                                                    {item.name}
                                                </Text>
                                                <View className="flex-row items-center mt-1">
                                                    <Text className="text-blue-600 font-bold">
                                                        {formatPrice(item.isPromotion && item.promotion ? item.promotion.finalPrice : item.price)}đ
                                                    </Text>
                                                    {item.isPromotion && item.promotion && (
                                                        <Text className="text-gray-400 text-xs line-through ml-2">
                                                            {formatPrice(item.price)}đ
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <View className="p-8 items-center">
                                    <Ionicons name="search" size={48} color="#d1d5db" />
                                    <Text className="mt-4 text-gray-500 text-center">
                                        Không tìm thấy sản phẩm phù hợp với từ khóa "{searchQuery}"
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </View>
    )
}

export default Header
