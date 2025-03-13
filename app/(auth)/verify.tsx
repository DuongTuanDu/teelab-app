import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';

const VerifyOTPScreen = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [countdown, setCountdown] = useState<number>(300);
    const [canResend, setCanResend] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    //   const { emailVerify } = useAppSelector(state => state.auth);

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

    const handlePaste = (text: string): void => {
        // Handle paste event
        if (text.length === 6 && !isNaN(Number(text))) {
            const otpArray = text.split('');
            setOtp(otpArray);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = (): void => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 số OTP');
            return;
        }

        console.log('OTP submitted:', otpValue);

        // Navigate based on verification purpose
        // if (isReset) {
        //   navigation.navigate('ResetPassword');
        // } else {
        //   navigation.navigate('Login');
        // }
    };

    const handleResend = (): void => {
        if (!canResend) return;

        // console.log('Resend OTP to:', emailVerify);
        startCountdown();

        // Call API to resend OTP here
        // dispatch(sendOTP({ email: emailVerify }))
    };

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
                        <Text className="text-2xl font-bold text-gray-800">XÁC THỰC OTP</Text>
                        <Text className="text-gray-500 mt-2 text-center px-8">
                            Chúng tôi đã gửi mã OTP đến email của bạn.
                            Vui lòng nhập mã để xác thực tài khoản.
                        </Text>
                        {/* {emailVerify && (
              <Text className="text-blue-600 font-medium mt-2">{emailVerify}</Text>
            )} */}
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
                            <Text className="text-gray-500">
                                Chưa nhận được mã? {' '}
                                {canResend ? (
                                    <TouchableOpacity onPress={handleResend}>
                                        <Text className="text-blue-600 font-medium">Gửi lại</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text>Gửi lại sau {countdown}s</Text>
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className="bg-[#4f637e] rounded-lg py-4 items-center"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-bold text-base">XÁC THỰC</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerifyOTPScreen;