import React, { useEffect, useState } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigations/AppNavigator";
import { AuthContext } from "./src/context/authcontext";
import storage from "./src/utils/storage";
import { myTheme } from "./src/utils/theme";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { fonts } from "./assets/fonts";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await storage.getToken();
        const role = await storage.getRole();

        if (token) {
          setToken(token);
          setRole(role);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);


  useEffect(() => {
    if (isReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isReady, fontsLoaded]);

  if (!isReady || !fontsLoaded) return null;

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AuthContext.Provider value={{ role, setRole, token, setToken }}>
          <NavigationContainer theme={myTheme}>
            <StatusBar barStyle={"dark-content"} />
            {token ? <AppNavigator /> : <LoginScreen />}
          </NavigationContainer>
        </AuthContext.Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
