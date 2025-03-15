import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/custombutton';
import { useLoginMutation } from '@/redux/auth/auth.query';
import Toast from 'react-native-toast-message';
import Storage from '@/helpers/storage';
import { authEmitter } from '@/helpers/authEmitter';
import { useAppDispatch } from '@/hooks/useRedux';
import { AuthActions } from '@/redux/auth/auth.slice';

interface ILoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  rememberMe: yup.boolean(),
});

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [securePassword, setSecurePassword] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loginCustomer, { isLoading, error }] = useLoginMutation()

  if (error) {
    Toast.show({
      type: 'error',
      text1: error?.message || "Có lỗi xảy ra khi đăng nhập"
    })
  }

  const formik = useFormik<ILoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const res = await loginCustomer({ email: values.email, password: values.password }).unwrap()
      if (res.success) {
        await Storage.setItem("ACCESS_TOKEN", res.accessToken);
        authEmitter.emit('tokenChanged', res.accessToken);

        if (values.rememberMe) {
          await Promise.all([
            AsyncStorage.setItem('email', values.email),
            AsyncStorage.setItem('password', values.password)
          ])
        }
        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công"
        })
        router.replace("/")
      }
    },
  });

  const toggleRememberMe = () => {
    formik.setFieldValue('rememberMe', !formik.values.rememberMe);
  };

  // Load saved credentials
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');

        if (savedEmail && savedPassword) {
          formik.setFieldValue('email', savedEmail);
          formik.setFieldValue('password', savedPassword);
          formik.setFieldValue('rememberMe', true);
        }
      } catch (error) {
        console.error('Failed to load credentials', error);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!isLoaded) {
      loadSavedCredentials();
    }
  }, [isLoaded]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5 pt-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-800">ĐĂNG NHẬP</Text>
            <Text className="text-gray-500 mt-2 text-center">
              Vui lòng đăng nhập để tiếp tục
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-6">
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

            <View>
              <Text className="text-gray-700 font-medium mb-2">Mật khẩu</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-50 border ${formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } rounded-lg p-4 pr-12 text-gray-900`}
                  placeholder="Nhập mật khẩu"
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

            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={toggleRememberMe}
              >
                <View
                  className={`h-5 w-5 rounded border flex items-center justify-center mr-2 ${formik.values.rememberMe
                    ? 'bg-[#4f637e] border-[#4f637e]'
                    : 'border-gray-400'
                    }`}
                >
                  {formik.values.rememberMe && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>
                <Text className="text-gray-700">Ghi nhớ đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text className="text-blue-600 font-medium">Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <CustomButton
            variant='dark'
            label='Đăng nhập'
            onPress={() => formik.handleSubmit()}
            size='xl'
            loading={isLoading}
          />

          {/* Social Login */}
          {/* <View className="mt-8 items-center">
            <Text className="text-gray-500 mb-4">Hoặc đăng nhập bằng</Text>
            <TouchableOpacity
              className="flex-row bg-white border border-gray-300 rounded-lg py-3 px-6 items-center"
            >
              <Image
                source={require('@/assets/images/google-icon.png')}
                style={{ width: 20, height: 20, marginRight: 12 }}
              />
              <Text className="text-gray-700 font-medium">Google</Text>
            </TouchableOpacity>
          </View> */}

          {/* Register Link */}
          <View className="mt-8 mb-8 items-center">
            <Text className="text-gray-600">
              Bạn chưa có tài khoản?{' '}
              <Text
                onPress={() => router.push('/register')}
                className="text-blue-600 font-medium"
              >
                Đăng ký
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;