import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#0061FF1A",
                    minHeight: 60,
                    height: 70,
                    elevation: 5,
                    paddingTop: 20,
                    borderRadius: 20,
                    marginHorizontal: 20,
                    marginBottom: 10,
                    zIndex: 100,
                },
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`${focused ? "bg-black p-3 rounded-full" : ""} items-center justify-center`}>
                            <Ionicons name="home" size={24} color={focused ? "white" : "#d3d3d3"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`${focused ? "bg-black p-3 rounded-full" : ""} items-center justify-center`}>
                            <Ionicons name={focused ? "bag" : "bag-handle"} size={24} color={focused ? "white" : "#d3d3d3"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`${focused ? "bg-black p-3 rounded-full" : ""} items-center justify-center`}>
                            <Ionicons name="settings" size={24} color={focused ? "white" : "#d3d3d3"} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;