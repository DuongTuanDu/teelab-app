import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/hooks/useRedux';

const TabsLayout = () => {
    const { isAuthenticated } = useAppSelector(state => state.auth)

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginTop: -5,
                    marginBottom: 5
                },
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    bottom: 25,
                    left: "50%",
                    marginLeft: -120,
                    width: 240,
                    height: 60,
                    borderRadius: 30,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                    paddingHorizontal: 10,
                    zIndex: 10,
                },
                headerShown: false,
                tabBarActiveTintColor: "#a3a3a3",
                tabBarInactiveTintColor: "#4b4b4b",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className={`items-center justify-center mt-[22px] ${focused ? "bg-black py-3 px-[13px] rounded-full" : ""}`}>
                            <Feather name="home" size={24} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className={`items-center justify-center mt-[22px] ${focused ? "bg-black py-3 px-[13px] rounded-full" : ""}`}>
                            <Feather name="shopping-bag" size={24} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className={`items-center justify-center mt-[22px] ${focused ? "bg-black py-3 px-[13px] rounded-full" : ""}`}>
                            <Ionicons name="settings-outline" size={24} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;