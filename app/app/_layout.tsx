import { CustomAlert } from "@/src/components/ui/custom-alert";
import { COLORS } from "@/src/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking, Text, View } from "react-native";
import "react-native-reanimated";
import "../src/theme/global.css";

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "@/src/constants/auth0-config";
import { useAuthStore } from "@/src/store/use-auth-store";
import { useEffect } from "react";
import { Auth0Provider } from "react-native-auth0";

export default function RootLayout() {
  const { initialized } = useAuthStore();

  if (!initialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: COLORS.textPrimary, fontWeight: "bold" }}>
          VANGUARD
        </Text>
      </View>
    );
  }

  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("Deep link received:", event.url);
    });

    return () => subscription.remove();
  }, []);
  console.log("token", useAuthStore.getState().token);
  return (
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
      <StatusBar style="auto" />
    </Auth0Provider>
  );
}
