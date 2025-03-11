import { Stack, useSegments } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "./global.css"
import { store } from "@/redux/store";
import { Provider } from 'react-redux'
import LayoutScreen from "@/components/layout";
import ReduxSync from "@/redux/redux-sync";

export default function RootLayout() {
  const segments = useSegments() as string[];
  const isAuthScreen = segments.includes("login") || segments.includes("register");

  return (
    <Provider store={store}>
      <GluestackUIProvider>
        <ReduxSync />
        {isAuthScreen ? (
          <Stack screenOptions={{ headerShown: false }} />
        ) : (
          <LayoutScreen>
            <Stack screenOptions={{ headerShown: false }} />
          </LayoutScreen>
        )}
      </GluestackUIProvider>
    </Provider>
  );
}
