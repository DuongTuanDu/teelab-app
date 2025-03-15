import Loading from '@/components/loading';
import { useAppSelector } from '@/hooks/useRedux';
import { Redirect, Stack } from 'expo-router'
import React from 'react'

const LayoutAuth = () => {
    const { isAuthenticated, authLoading } = useAppSelector(state => state.auth);

    if (authLoading) return <Loading />
    if (isAuthenticated && !authLoading) return <Redirect href="/" />

    return <Stack screenOptions={{ headerShown: false }} />
}

export default LayoutAuth
