import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/hooks/useRedux';
// import { setEmailVerify } from '@/redux/auth/auth.slice';

interface ForgotPasswordFormValues {
    email: string;
}

const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
});

const ForgotPasswordScreen = () => {
    const dispatch = useAppDispatch();

    const formik = useFormik<ForgotPasswordFormValues>({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: (values) => {
            // Xử lý gửi OTP ở đây
            console.log('Send OTP to:', values.email);
            //dispatch(setEmailVerify(values.email));
        },
    });

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="px-5 pt-4 mb-4 flex-row items-center">
                    <TouchableOpacity
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Feather name="arrow-left" size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-5">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-2xl font-bold text-gray-800">QUÊN MẬT KHẨU</Text>
                        <Text className="text-gray-500 mt-2 text-center px-8">
                            Vui lòng nhập email đã đăng ký để nhận mã xác thực
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4 mb-8">
                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Email</Text>
                            <TextInput
                                className={`bg-gray-50 border ${formik.touched.email && formik.errors.email
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    } rounded-lg p-4 text-gray-900`}
                                placeholder="Nhập email của bạn"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formik.values.email}
                                onChangeText={formik.handleChange('email')}
                                onBlur={formik.handleBlur('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <Text className="text-red-500 text-xs mt-1">{formik.errors.email}</Text>
                            )}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className="bg-[#4f637e] rounded-lg py-4 items-center"
                    >
                        <Text className="text-white font-bold text-base">GỬI MÃ XÁC THỰC</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View className="mt-8 items-center">
                        <TouchableOpacity >
                            <Text className="text-blue-600 font-medium">Quay lại đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;