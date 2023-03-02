import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";
import theme from "./constants/theme";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Almarai_300Light,
  Almarai_400Regular,
  Almarai_700Bold,
  Almarai_800ExtraBold,
} from "@expo-google-fonts/almarai";
import { store } from "./redux/store";
import { images } from "./constants/images";
import { Asset } from "expo-asset";
import { useAppState } from "./hooks/useAppState";
import { useOnlineManager } from "./hooks/useOnlineManager";
import { QueryClient, QueryClientProvider, focusManager } from "react-query";
import AppWrapper from "./AppWrapper/AppWrapper";
SplashScreen.preventAutoHideAsync();
/* ------------------------------------ x ----------------------------------- */
function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});
/* ------------------------------------ x ----------------------------------- */
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useOnlineManager();

  useAppState(onAppStateChange);
  let [fontsLoaded] = useFonts({
    Almarai_300Light,
    Almarai_400Regular,
    Almarai_700Bold,
    Almarai_800ExtraBold,
  });

  const cacheImages = () => {
    const imgs = images.map((e) => {
      return Asset.fromModule(e).downloadAsync();
    });
    return Promise.all(imgs);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await cacheImages();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  useEffect(() => {
    const ready = async () => {
      if (appIsReady) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.log("🚀 ~ file: App.js:58 ~ onLayoutRootView ~ error", error);
        }
      }
    };
    ready();
  }, [appIsReady]);

  if (!fontsLoaded || !appIsReady) {
    return null;
  }
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={theme}>
          <AppWrapper />
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}
