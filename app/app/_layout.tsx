import { CustomAlert } from "@/src/components/ui/custom-alert";
import { COLORS } from "@/src/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking, Text, View, StyleSheet } from "react-native";
import "react-native-reanimated";
import "../src/theme/global.css";

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "@/src/constants/auth0-config";
import { useAuthStore } from "@/src/store/use-auth-store";
import { useEffect, useState } from "react";
import { Auth0Provider } from "react-native-auth0";
import { CustomSplashScreen } from "@/src/components/ui/custom-splash-screen";

export default function RootLayout() {
  const { initialized } = useAuthStore();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("Deep link received:", event.url);
    });

    return () => subscription.remove();
  }, []);

  console.log("token", useAuthStore.getState().token);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {initialized && (
        <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/index" />
            <Stack.Screen name="(main)" />
            <Stack.Screen
              name="approval/[id]"
              options={{ presentation: "modal", title: "Approval" }}
            />
          </Stack>
          <CustomAlert />
        </Auth0Provider>
      )}

      {!animationComplete && (
        <CustomSplashScreen
          isAppReady={initialized}
          onAnimationComplete={() => setAnimationComplete(true)}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}
