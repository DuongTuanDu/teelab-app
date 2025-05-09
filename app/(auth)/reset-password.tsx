import React, { useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useRouter } from 'expo-router';
import { useResetPasswordMutation } from '@/redux/auth/auth.query';
import Toast from 'react-native-toast-message';
import CustomButton from '@/components/custombutton';
import { AuthActions } from '@/redux/auth/auth.slice';
import { Redirect } from 'expo-router';

const resetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
        )
        .required('Vui lòng nhập mật khẩu mới'),
    rePassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
        .required('Vui lòng nhập lại mật khẩu'),
});

const ResetPasswordScreen = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [securePassword, setSecurePassword] = useState<boolean>(true);
    const [secureRePassword, setSecureRePassword] = useState<boolean>(true);
    const { emailVerify, isAuthenticated, isResetPassword } = useAppSelector(state => state.auth);
    const [resetPassword, { isLoading, error }] = useResetPasswordMutation()

    useEffect(() => {
        if (!emailVerify || !isResetPassword) {
            if (!isAuthenticated) {
                <Redirect href="/login" />
            } else {
                <Redirect href="/" />
            }
        }
    }, [emailVerify, isResetPassword, isAuthenticated]);

    if (error) {
        Toast.show({
            type: "error",
            text1: error?.message || "Có lỗi xảy ra khi tạo mới mật khẩu"
        })
    }

    const formik = useFormik({
        initialValues: {
            password: '',
            rePassword: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            const res = await resetPassword({
                email: emailVerify,
                password: values.password,
            }).unwrap();

            if (res.success) {
                Toast.show({
                    type: "success",
                    text1: res.message
                })
                dispatch(AuthActions.setEmailVerify(""))
                dispatch(AuthActions.setIsResetPassword(false))
                router.replace("/login")
            }
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
                        <Text className="text-2xl font-bold text-gray-800">ĐẶT LẠI MẬT KHẨU</Text>
                        <Text className="text-gray-500 mt-2 text-center px-8">
                            Tạo mật khẩu mới cho tài khoản của bạn
                        </Text>
                        {/* {emailVerify && (
                            <Text className="text-blue-600 font-medium mt-2">{emailVerify}</Text>
                        )} */}
                    </View>

                    {/* Form */}
                    <View className="space-y-4 mb-8">
                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Mật khẩu mới</Text>
                            <View className="relative">
                                <TextInput
                                    className={`bg-gray-50 border ${formik.touched.password && formik.errors.password
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        } rounded-lg p-4 pr-12 text-gray-900`}
                                    placeholder="Nhập mật khẩu mới"
                                    secureTextEntry={securePassword}
                                    value={formik.values.password}
                                    onChangeText={formik.handleChange('password')}
                                    onBlur={formik.handleBlur('password')}
                                />
                                <TouchableOpacity
                                    className="absolute right-3 top-4"
                                    onPress={() => setSecurePassword(!securePassword)}
                                >
                                    <Feather
                                        name={securePassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                            {formik.touched.password && formik.errors.password && (
                                <Text className="text-red-500 text-xs mt-1">{formik.errors.password}</Text>
                            )}
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Xác nhận mật khẩu mới</Text>
                            <View className="relative">
                                <TextInput
                                    className={`bg-gray-50 border ${formik.touched.rePassword && formik.errors.rePassword
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        } rounded-lg p-4 pr-12 text-gray-900`}
                                    placeholder="Nhập lại mật khẩu mới"
                                    secureTextEntry={secureRePassword}
                                    value={formik.values.rePassword}
                                    onChangeText={formik.handleChange('rePassword')}
                                    onBlur={formik.handleBlur('rePassword')}
                                />
                                <TouchableOpacity
                                    className="absolute right-3 top-4"
                                    onPress={() => setSecureRePassword(!secureRePassword)}
                                >
                                    <Feather
                                        name={secureRePassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                            {formik.touched.rePassword && formik.errors.rePassword && (
                                <Text className="text-red-500 text-xs mt-1">{formik.errors.rePassword}</Text>
                            )}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <CustomButton
                        label="ĐẶT LẠI MẬT KHẨU"
                        loading={isLoading}
                        size="xl"
                        variant="dark"
                        onPress={() => formik.handleSubmit()}
                    />
                    {/* Login Link */}
                    <View className="mt-8 items-center">
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-medium">Quay lại đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;