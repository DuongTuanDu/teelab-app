import { EvilIcons, Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input'
import { useGetAllCategoryQuery } from '@/redux/category/category.query'
import { CategoryActions } from '@/redux/category/category.slice'
import Loading from '../loading'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import DrawerMenu from '../drawer-menu'
import { useRouter } from 'expo-router'
import { useSegments } from 'expo-router'
import AuthMenu from './auth-menu'
import { TouchableOpacity } from 'react-native'

interface IProps {
    isShowSearch?: boolean
}
const Header = ({ isShowSearch = true }: IProps) => {
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
            {
                isShowSearch && !isAuthScreen &&
                <View className="px-6 pb-4">
                    <Input className='rounded-full bg-slate-50' >
                        <InputField placeholder="Tìm kiếm sản phẩm..." />
                        <InputSlot>
                            <InputIcon>
                                <Ionicons name="search-circle" size={24} color="black" />
                            </InputIcon>
                        </InputSlot>
                    </Input>
                </View>
            }
        </View>
    )
}

export default Header
