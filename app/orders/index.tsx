import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Loading from '@/components/loading';
import { useAppSelector } from '@/hooks/useRedux';
import { useGetOrdersQuery } from '@/redux/order/order.query';
import { Redirect } from 'expo-router';
import { statusTypes } from '@/const';
import { IOrder } from '@/redux/order/order.interface';
import OrderItem from './order.item';
import { eventEmitter } from '@/helpers/eventEmitter';


interface IQuery {
    page: number;
    pageSize: number;
    status: string;
}

// Empty state component
const EmptyOrders = () => (
    <View className="flex-1 justify-center items-center p-8">
        <Feather name="shopping-bag" size={64} color="#CBD5E1" />
        <Text className="text-gray-500 text-lg mt-4 text-center">Bạn chưa có đơn hàng nào</Text>
        <Text className="text-gray-400 text-center mt-2">Hãy mua sắm để bắt đầu đặt đơn</Text>
    </View>
);

// Pagination component
const Pagination = (
    { currentPage, totalPages, onChangePage }:
        { currentPage: number, totalPages: number, onChangePage: (page: number) => void }) => {

    if (totalPages <= 1) return null;

    return (
        <View className="flex-row justify-center items-center my-4">
            <TouchableOpacity
                onPress={() => onChangePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 ${currentPage === 1 ? 'opacity-50' : ''}`}
            >
                <Feather name="chevron-left" size={20} color="#4B5563" />
            </TouchableOpacity>

            <Text className="mx-4 text-gray-700">
                Trang {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
                onPress={() => onChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 ${currentPage === totalPages ? 'opacity-50' : ''}`}
            >
                <Feather name="chevron-right" size={20} color="#4B5563" />
            </TouchableOpacity>
        </View>
    );
};

const OrderHistory = () => {
    const { isAuthenticated, authLoading } = useAppSelector(state => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    // Status filter state
    const [query, setQuery] = useState<IQuery>({
        page: 1,
        pageSize: 10,
        status: "pending"
    });

    const { data, isLoading, refetch } = useGetOrdersQuery(
        { ...query },
        { skip: !isAuthenticated }
    );

    useEffect(() => {
        eventEmitter.on('createOrder', refetch);

        return () => {
            eventEmitter.off('createOrder', refetch);
        };
    }, [])

    const {
        data: orders = [],
        statusCounts = {
            pending: 0,
            processing: 0,
            shipping: 0,
            delivered: 0,
            cancelled: 0,
        },
        pagination = {
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPage: 0
        }
    } = data || {};

    // Handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        refetch();
        setRefreshing(false);
    };

    // Handle cancel order action
    const handlePressCancel = (orderId: string) => {

    };

    // Handle review action
    const handlePressReview = (orderId: string, productId: string) => {

    };

    // Handle complete order action
    const handlePressComplete = (orderId: string) => {

    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Handle status filter change
    const handleStatusChange = (status: string) => {
        setQuery({
            page: 1,
            pageSize: 10,
            status
        });
    };

    // Auth checking
    if (authLoading) return <Loading />;
    if (!isAuthenticated && !authLoading) return <Redirect href="/login" />;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-800">Đơn hàng của tôi 🛍️</Text>
            </View>

            {/* Status filter tabs */}
            <View className="bg-white">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                >
                    {statusTypes.map((statusType) => (
                        <TouchableOpacity
                            key={statusType.key}
                            onPress={() => handleStatusChange(statusType.key)}
                            className={`py-3 px-4 mx-1 ${query.status === statusType.key
                                ? 'border-b-2 border-blue-500'
                                : 'border-b-2 border-transparent'
                                }`}
                        >
                            <Text
                                className={`${query.status === statusType.key
                                    ? 'text-blue-500 font-medium'
                                    : 'text-gray-600'
                                    }`}
                            >
                                {statusType.label} {statusCounts[statusType.key as keyof typeof statusCounts] > 0 && `(${statusCounts[statusType.key as keyof typeof statusCounts]})`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Orders list */}
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <OrderItem
                            order={item}
                            onPressReview={handlePressReview}
                            onPressComplete={handlePressComplete}
                            onPressCancel={handlePressCancel}
                        />
                    )}
                    contentContainerStyle={{ padding: 12 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={<EmptyOrders />}
                    ListFooterComponent={
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPage}
                            onChangePage={handlePageChange}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default OrderHistory;
