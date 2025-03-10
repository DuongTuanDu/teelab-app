import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input'
import { useGetAllCategoryQuery } from '@/redux/category/category.query'
import { CategoryActions } from '@/redux/category/category.slice'
import Loading from '../loading'
import { useAppDispatch } from '@/hooks/useRedux'

interface IProps {
    isShowSearch?: boolean
}
const Header = ({ isShowSearch = true }: IProps) => {
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
            <View className="px-4 py-2 bg-white w-full flex-row flex items-center justify-between gap-4">
                <Ionicons name="menu" size={24} color="black" />
                <Image source={{ uri: "https://teelab-three.vercel.app/assets/logo-H_P3Ts4s.png" }} className='h-14 w-36 object-cover' />
                <Image source={{ uri: "https://avatar.iran.liara.run/public" }} className='h-10 w-10 rounded-full' />
            </View>
            {
                isShowSearch &&
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
