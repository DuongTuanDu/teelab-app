import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
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

interface IProps {
    isShowSearch?: boolean
}
const Header = ({ isShowSearch = true }: IProps) => {
    const [searchText, setSearchText] = useState('');
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

    useEffect(() => {
        if (data?.data) {
            dispatch(CategoryActions.setCategories(data.data))
        }
    }, [data?.data])

    if (isLoading) return <Loading />

    const handleSearch = () => {

    };

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
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity className="p-2" onPress={handleSearch}>
                            <Ionicons name="search" size={24} color="#5b636a" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )
}

export default Header
