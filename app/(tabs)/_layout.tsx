// import { Tabs } from 'expo-router';
// import React from 'react';
// import { View } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const TabsLayout = () => {
//     return (
//         <Tabs
//             screenOptions={{
//                 tabBarShowLabel: false,
//             }}
//         >
//             <Tabs.Screen
//                 name="index"
//                 options={{
//                     tabBarIcon: ({ focused }) => (
//                         <View className={`${focused ? "bg-black p-3 rounded-full" : ""} items-center justify-center`}>
//                             <Ionicons name="home" size={24} color={focused ? "white" : "#d3d3d3"} />
//                         </View>
//                     ),
//                 }}
//             />
//             <Tabs.Screen
//                 name="cart"
//                 options={{
//                     tabBarIcon: ({ focused }) => (
//                         <View className={`${focused ? "bg-black p-3 rounded-full" : ""} items-center justify-center`}>
//                             <Ionicons name={focused ? "bag" : "bag-handle"} size={24} color={focused ? "white" : "#d3d3d3"} />
//                         </View>
//                     ),
//                 }}
//             />
//             <Tabs.Screen
//                 name="profile"
//                 options={{
//                     tabBarIcon: ({ focused }) => (
//                         <View className={`${focused ? "bg-black p-3 rounded-full" : ""} items-center justify-center`}>
//                             <Ionicons name="settings" size={24} color={focused ? "white" : "#d3d3d3"} />
//                         </View>
//                     ),
//                 }}
//             />
//         </Tabs>
//     );
// };

// export default TabsLayout;

import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TabsLayout = () => {
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
                },
                headerShown: false,
                tabBarActiveTintColor: "#7040F2",
                tabBarInactiveTintColor: "#a3a3a3",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color }) => (
                        <View className="items-center justify-center">
                            <Ionicons name="home" size={22} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    tabBarLabel: "Search",
                    tabBarIcon: ({ color }) => (
                        <View className="items-center justify-center ">
                            <Ionicons name="search" size={22} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color }) => (
                        <View className="items-center justify-center">
                            <Ionicons name="person" size={22} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;