import CartList from '@/components/cart'
import CheckoutForm from '@/components/checkout'
import { useAppSelector } from '@/hooks/useRedux'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native'

const Cart = () => {
    const { carts } = useAppSelector(state => state.cart)
    const [open, setOpen] = useState<boolean>(true)
    return (
        <SafeAreaView className="flex-1 bg-white">
            <CheckoutForm {...{
                open,
                onClose: () => setOpen(false),
                products: carts
            }} />
            <CartList />
        </SafeAreaView>
    )
}

export default Cart
