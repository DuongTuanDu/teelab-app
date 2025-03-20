import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { updateAccount } from '@/redux/auth/auth.thunk';
import { AuthActions } from '@/redux/auth/auth.slice';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as yup from 'yup';
import CustomButton from '@/components/custombutton';
import { IAccount } from '@/redux/auth/auth.interface';
import { deleteFile, uploadFile } from '@/utils/cloudinary';
import * as ImagePicker from 'expo-image-picker';

interface IAvatar {
    url?: string;
    publicId?: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập họ tên'),
    email: yup.string().email('Email không hợp lệ'),
    password: yup.string(),
    rePassword: yup.string().test(
        'passwords-match',
        'Mật khẩu mới không khớp vui lòng thử lại',
        function (value) {
            return !this.parent.password || this.parent.password === value;
        }
    )
});

const Profile = () => {
    const dispatch = useAppDispatch();
    const { customer } = useAppSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<IAvatar>({});
    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    useEffect(() => {
        if (customer) {
            setAvatar({
                url: customer.avatar?.url,
                publicId: customer.avatar?.publicId,
            });
        }
    }, [customer]);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Không thể chọn ảnh',
                text2: 'Vui lòng thử lại sau',
            });
        }
    };

    const onSubmit = async (values: IAccount) => {
        try {
            setLoading(true);
            let avatarUpload = avatar;

            if (selectedImage) {
                const resUpload = await uploadFile(selectedImage);
                avatarUpload = {
                    url: resUpload.secure_url,
                    publicId: resUpload.public_id,
                };
            }

            const updatedUserInfo = {
                ...values,
                avatar: avatarUpload,
            };

            console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
            console.log("Sending request to update account");
            const res = await dispatch(updateAccount(updatedUserInfo)).unwrap();

            if (res.success) {
                const isNewAvatarUploaded =
                    avatarUpload.publicId && avatarUpload.publicId !== avatar?.publicId;

                if (isNewAvatarUploaded && avatar.publicId) {
                    await deleteFile(avatar.publicId);
                }

                dispatch(AuthActions.setUserInfo(res.data));
                Toast.show({
                    type: 'success',
                    text1: res.message,
                });
                setSelectedImage(null);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Cập nhật thất bại',
                text2: 'Vui lòng thử lại sau',
            });
        } finally {
            setLoading(false);
        }
    };

    const initialValues: IAccount = {
        name: customer?.name || '',
        email: customer?.email || '',
        password: '',
        rePassword: '',
    };

    return (
        <ScrollView className="flex-1">
            <View className="p-4">
                {/* Avatar Section */}
                <View className="items-center mb-8">
                    <View className="relative">
                        <View className="h-28 w-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                            {(selectedImage || avatar?.url) ? (
                                <Image
                                    source={{ uri: selectedImage || avatar?.url }}
                                    className="w-full h-full"
                                />
                            ) : (
                                <View className="w-full h-full items-center justify-center">
                                    <Feather name="user" size={56} color="#9CA3AF" />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
                        >
                            <Feather name="camera" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold mt-4 mb-1 text-gray-800">
                        {customer?.name}
                    </Text>
                    <Text className="text-gray-500">
                        {customer?.email}
                    </Text>
                </View>

                {/* Form Section */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View className="w-full">
                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Họ và tên</Text>
                                <TextInput
                                    className={`bg-gray-50 border rounded-lg p-4 text-gray-900 ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Họ và tên"
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                />
                                {touched.name && errors.name && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
                                )}
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                                <TextInput
                                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-700"
                                    value={values.email}
                                    editable={false}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Mật khẩu mới</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900"
                                    placeholder="Mật khẩu mới"
                                    secureTextEntry
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-700 font-medium mb-2">Nhập lại mật khẩu</Text>
                                <TextInput
                                    className={`bg-gray-50 border rounded-lg p-4 text-gray-900 ${touched.rePassword && errors.rePassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Nhập lại mật khẩu"
                                    secureTextEntry
                                    value={values.rePassword}
                                    onChangeText={handleChange('rePassword')}
                                    onBlur={handleBlur('rePassword')}
                                />
                                {touched.rePassword && errors.rePassword && (
                                    <Text className="text-red-500 text-xs mt-1">{errors.rePassword}</Text>
                                )}
                            </View>

                            <CustomButton
                                label="Cập nhật ngay"
                                loading={loading}
                                onPress={() => handleSubmit()}
                                variant="primary"
                                size="xl"
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>
    );
};

export default Profile;