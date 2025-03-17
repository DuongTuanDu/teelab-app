import { Stack } from "expo-router";
import "./global.css"
import { store } from "@/redux/store";
import { Provider } from 'react-redux'
import LayoutScreen from "@/components/layout";
import ReduxSync from "@/redux/redux-sync";
import Toast, { ErrorToast, InfoToast, SuccessToast, ToastConfig } from "react-native-toast-message";
import { Feather, Ionicons } from '@expo/vector-icons';
import { View } from "react-native";

const toastConfig: ToastConfig = {
  success: (props) => (
    <SuccessToast
      {...props}
      text1NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
          <Feather name="check-circle" size={24} color="#10b981" />
        </View>
      )}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
          <Feather name="alert-circle" size={24} color="#ef4444" />
        </View>
      )}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      text1NumberOfLines={2}
      renderLeadingIcon={() => (
        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
        </View>
      )}
    />
  )
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ReduxSync />
      <LayoutScreen>
        <Stack screenOptions={{ headerShown: false }} />
      </LayoutScreen>
      <Toast config={toastConfig} />
    </Provider>
  );
}
