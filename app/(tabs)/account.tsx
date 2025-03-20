import Loading from '@/components/loading';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import OrderHistory from '../orders';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native';
import { logout } from '@/redux/auth/auth.slice';
import Profile from '@/components/profile';

const Account = () => {
  const { isAuthenticated, authLoading } = useAppSelector(state => state.auth);

  if (authLoading) return <Loading />

  if (!isAuthenticated && !authLoading) return <Redirect href="/login" />;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string>('profile');
  const { customer } = useAppSelector(state => state.auth);

  const AccountContent = () => {
    switch (selected) {
      case 'profile':
        return <Profile />;
      case 'order':
        return <OrderHistory />;
      default:
        return <Profile />;
    }
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <Feather name="user" size={24} color="#4B5563" />,
      text: 'Hồ sơ'
    },
    {
      key: 'cart',
      icon: <Feather name="shopping-bag" size={24} color="#4B5563" />,
      text: 'Giỏ hàng'
    },
    {
      key: 'order',
      icon: <MaterialIcons name="local-offer" size={24} color="#4B5563" />,
      text: 'Đơn hàng'
    },
    {
      key: 'logout',
      icon: <Ionicons name="exit-outline" size={24} color="#EF4444" />,
      text: 'Đăng xuất',
      textColor: '#EF4444'
    }
  ];

  const handleMenuPress = (key: string) => {
    if (key === 'cart') {
      router.push('/cart');
      return;
    }

    if (key === 'logout') {
      dispatch(logout());
      Toast.show({
        type: 'success',
        text1: 'Đăng xuất thành công'
      });
      router.push('/');
      return;
    }

    setSelected(key);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="px-4 py-4">
          <View className="py-4 flex flex-col gap-4">
            {/* Menu Card */}
            <View className="w-full">
              <View className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* User Info Header */}
                <View className="flex-row p-4 items-center space-x-3 border-b border-gray-100">
                  <Image 
                    source={{ uri: customer?.avatar?.url }} 
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">{customer?.name}</Text>
                    <Text className="text-sm text-gray-500 truncate">{customer?.email}</Text>
                  </View>
                </View>

                {/* Menu Items */}
                <View className="px-2 py-2">
                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => handleMenuPress(item.key)}
                      className={`flex-row items-center py-3 px-2 mb-2 rounded-md ${
                        selected === item.key ? 'bg-gray-100' : ''
                      }`}
                    >
                      <View className="mr-3">{item.icon}</View>
                      <Text className={`text-base font-medium ${
                        item.key === 'logout' ? 'text-red-500' : 'text-gray-700'
                      }`}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Content Card */}
            <View className="flex-grow w-full">
              <View className="bg-white rounded-lg shadow-sm p-4 mb-7">
                <AccountContent />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Account
