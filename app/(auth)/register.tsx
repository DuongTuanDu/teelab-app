import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useRedux';
import { useReducedMotion } from 'react-native-reanimated';
import { useRegisterMutation } from '@/redux/auth/auth.query';
import Toast from 'react-native-toast-message';
import CustomButton from '@/components/custombutton';
import { AuthActions } from '@/redux/auth/auth.slice';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .required('Vui lòng nhập họ tên'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    )
    .required('Vui lòng nhập mật khẩu'),
  rePassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
});

const RegisterScreen = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [securePassword, setSecurePassword] = useState<boolean>(true);
  const [secureRePassword, setSecureRePassword] = useState<boolean>(true);
  const [registerCustomer, { isLoading, error }] = useRegisterMutation()

  if (error) {
    Toast.show({
      type: "error",
      text1: error?.message || "Có lỗi xảy ra khi đăng ký"
    })
  }

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const res = await registerCustomer({
        email: values.email,
        password: values.password,
        name: values.name
      }).unwrap();

      if (res.success) {
        Toast.show({
          type: "success",
          text1: res.message
        })
        dispatch(AuthActions.setEmailVerify(values.email))
        router.push('/verify')
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5 pt-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-800">ĐĂNG KÝ</Text>
            <Text className="text-gray-500 mt-2 text-center">
              Tạo tài khoản mới để tiếp tục
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Họ và tên</Text>
              <TextInput
                className={`bg-gray-50 border ${formik.touched.name && formik.errors.name
                  ? 'border-red-500'
                  : 'border-gray-300'
                  } rounded-lg p-4 text-gray-900`}
                placeholder="Nhập họ và tên"
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                onBlur={formik.handleBlur('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <Text className="text-red-500 text-xs mt-1">{formik.errors.name}</Text>
              )}
            </View>

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

            <View>
              <Text className="text-gray-700 font-medium mb-2">Nhập lại mật khẩu</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-50 border ${formik.touched.rePassword && formik.errors.rePassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                    } rounded-lg p-4 pr-12 text-gray-900`}
                  placeholder="Nhập lại mật khẩu"
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

          {/* Register Button */}
          <CustomButton
            label='Đăng ký'
            size="xl"
            loading={isLoading}
            onPress={() => formik.handleSubmit()}
            variant='dark'
          />
          {/* Login Link */}
          <View className="mt-8 mb-8 items-center">
            <Text className="text-gray-600">
              Đã có tài khoản?{' '}
              <Text
                onPress={() => router.push('/login')}
                className="text-blue-600 font-medium"
              >
                Đăng nhập
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;