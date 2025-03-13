import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "./global.css"
import { store } from "@/redux/store";
import { Provider } from 'react-redux'
import LayoutScreen from "@/components/layout";
import ReduxSync from "@/redux/redux-sync";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GluestackUIProvider>
        <ReduxSync />
        <LayoutScreen>
            <Stack screenOptions={{ headerShown: false }} />
        </LayoutScreen>
        <Toast />
      </GluestackUIProvider>
    </Provider>
  );
}
