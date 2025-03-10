import React from 'react';
import { View, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import Header from '../header';

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutScreen = ({ children }: LayoutProps) => {
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
