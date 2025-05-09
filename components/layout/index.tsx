import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import Header from '../header';
import Storage from '@/helpers/storage';
import { useGetAccountQuery } from '@/redux/auth/auth.query';
import Loading from '../loading';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { AuthActions, getAccount } from '@/redux/auth/auth.slice';
import { eventEmitter } from '@/helpers/eventEmitter';
import { io } from 'socket.io-client';
interface IProps {
    children: React.ReactNode;
}
const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_BASE_API_URL;

const LayoutScreen = ({ children }: IProps) => {
    const { isAuthenticated, customer } = useAppSelector(state => state.auth);
    const [token, setToken] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const { data, isLoading } = useGetAccountQuery(undefined, {
        skip: !token || isAuthenticated
    })

    useEffect(() => {
        if (isAuthenticated) {
            const socketConnect = io(SOCKET_SERVER_URL, {
                query: {
                    userId: customer?._id,
                    userType: "customer",
                },
            });
            dispatch(AuthActions.setSocket(socketConnect));

            return () => {
                socketConnect.disconnect();
                dispatch(AuthActions.setSocket(null));
            };
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchToken = async () => {
            const accessToken = await Storage.getItem<string | null>("ACCESS_TOKEN");
            setToken(accessToken);
        };
        fetchToken();

        const tokenListener = (newToken: string) => {
            setToken(newToken);
            dispatch(getAccount());
        };
        eventEmitter.on('tokenChanged', tokenListener);

        return () => {
            eventEmitter.off('tokenChanged', tokenListener);
        };
    }, []);

    useEffect(() => {
        dispatch(AuthActions.setAuthLoading(isLoading))
    }, [isLoading])

    useEffect(() => {
        if (data?._id) {
            dispatch(AuthActions.setCustomer(data))
            dispatch(AuthActions.setIsAuthenticated(true))
        }
    }, [data?._id])

    if (isLoading) return <Loading />

    return (
        <KeyboardAvoidingView
            key={token}
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