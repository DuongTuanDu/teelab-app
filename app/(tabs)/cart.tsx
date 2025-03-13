import CartList from '@/components/cart'
import React from 'react'
import { SafeAreaView } from 'react-native'

const Cart = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <CartList />
        </SafeAreaView>
    )
}

export default Cart
