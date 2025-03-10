import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const ProductDetail = () => {
    const { slug } = useLocalSearchParams()

    return (
        <View>
            <Text>ProductDetail</Text>
        </View>
    )
}

export default ProductDetail
