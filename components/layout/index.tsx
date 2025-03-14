import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import Header from '../header';
import Storage from '@/helpers/storage';
import { useGetAccountQuery } from '@/redux/auth/auth.query';
import Loading from '../loading';
import { useAppDispatch } from '@/hooks/useRedux';
import { AuthActions } from '@/redux/auth/auth.slice';

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutScreen = ({ children }: LayoutProps) => {
    const [token, setToken] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const fetchToken = async () => {
            const accessToken = await Storage.getItem<string | null>("ACCESS_TOKEN");
            setToken(accessToken);
        };
        fetchToken();
    }, []);

    const { data, isLoading } = useGetAccountQuery(undefined, {
        skip: !token
    })

    useEffect(() => {
        dispatch(AuthActions.setAuthLoading(isLoading))
    }, [isLoading])

    useEffect(() => {
        if (data?.data) {
            dispatch(AuthActions.setCustomer(data.data))
            dispatch(AuthActions.setIsAuthenticated(true))
        }
    }, [data?.data])

    if (isLoading) return <Loading />

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="white" />

                {/* Header */}
                <View className="z-10">
                    <Header />
                </View>

                {/* Content area - takes the majority of space */}
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {children}
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default LayoutScreen;