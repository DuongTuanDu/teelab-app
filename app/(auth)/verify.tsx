import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import Toast from 'react-native-toast-message';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/redux/auth/auth.query';
import CustomButton from '@/components/custombutton';
import { useRouter } from 'expo-router';
import { AuthActions } from '@/redux/auth/auth.slice';

const VerifyOTPScreen = () => {
    const router = useRouter()
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [countdown, setCountdown] = useState<number>(300);
    const [canResend, setCanResend] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { emailVerify, isAuthenticated, isResetPassword } = useAppSelector(state => state.auth);
    const [verify, { isLoading, error: errorVerify }] = useVerifyOtpMutation();
    const [sendOtp, { error: errorSendOtp }] = useSendOtpMutation()

    if (!emailVerify) {
        if (!isAuthenticated) {
            router.push('/login')
        } else {
            router.push('/')
        }
    }

    if (errorVerify) {
        Toast.show({
            type: "error",
            text1: errorVerify?.message || "Có lỗi xảy ra khi xác thực"
        })
    }

    if (errorSendOtp) {
        Toast.show({
            type: "error",
            text1: errorSendOtp?.message || "Có lỗi xảy ra khi gửi mã"
        })
    }

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);

        // Auto-focus first input
        if (inputRefs.current[0]) {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }

        // Start countdown
        startCountdown();

        return () => {
            // Clean up any timers if component unmounts
        };
    }, []);

    const startCountdown = (): void => {
        setCanResend(false);
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);
    };

    const handleChange = (text: string, index: number): void => {
        if (isNaN(Number(text))) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-advance to next input
        if (text !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ): void => {
        // Go back to previous input on backspace
        if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            Toast.show({
                type: "error",
                text1: "Vui lòng nhập đủ 6 số OTP"
            })
            return;
        }

        const res = await verify({ email: emailVerify, otp: otpValue }).unwrap()
        if (res.success) {
            Toast.show({
                type: "success",
                text1: res.message
            })
            if (isResetPassword) {
                router.push("/reset-password")
            } else {
                dispatch(AuthActions.setEmailVerify(""))
                router.push("/login")
            }
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        startCountdown();
        const res = await sendOtp({ email: emailVerify }).unwrap()
        if (res.success) {
            Toast.show({
                type: "success",
                text1: res.message
            })
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="px-5 pt-4 mb-4 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Feather name="arrow-left" size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-5">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-2xl font-bold text-gray-800">XÁC THỰC OTP</Text>
                        <Text className="text-gray-500 mt-2 text-center px-8">
                            Chúng tôi đã gửi mã OTP đến email của bạn.
                            Vui lòng nhập mã để xác thực tài khoản.
                        </Text>
                        {emailVerify && (
                            <Text className="text-blue-600 font-medium mt-2">{emailVerify}</Text>
                        )}
                    </View>

                    {/* OTP Input */}
                    <View className="mb-8">
                        <View className="flex-row justify-between mb-6">
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    className="w-12 h-14 px-4 py-4 bg-gray-50 border border-gray-300 rounded-lg text-center text-lg font-bold text-gray-900"
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    value={digit}
                                    onChangeText={(text) => handleChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    selectionColor="#3B82F6"
                                />
                            ))}
                        </View>

                        <View className="flex-row justify-center">
                            <Text className="text-gray-500">Chưa nhận được mã? </Text>
                            {canResend ? (
                                <TouchableOpacity onPress={handleResend}>
                                    <Text className="text-blue-600 font-medium">Gửi lại</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text className="text-gray-500">Gửi lại sau {countdown}s</Text>
                            )}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <CustomButton
                        label="XÁC THỰC"
                        loading={isLoading}
                        size="xl"
                        variant="dark"
                        onPress={handleSubmit}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerifyOTPScreen;