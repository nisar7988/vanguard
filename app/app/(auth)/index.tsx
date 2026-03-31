import { GradientButton } from "@/src/components/gradient-button";
import { useAuth0Login } from "@/src/hooks/use-auth0-login";
import { useAuthStore } from "@/src/store/use-auth-store";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";

export default function LoginScreen() {
  const { token } = useAuthStore();
  const { login, isLoading, isReady } = useAuth0Login();

  if (token) {
    return <Redirect href="/(main)/dashboard" />;
  }

  return (
    <View className="flex-1 bg-black">
      <Image
        source={require("@/assets/images/icon.png")} // your generated image
        className="w-full h-full"
        resizeMode="cover"
      />
      <StatusBar style="light" />

      <View className="absolute bottom-8 w-full ">
        <View className="items-center my-2">
          <Text className="text-white text-4xl font-bold tracking-wide">
            Vanguard
          </Text>

          <Text className="text-gray-400 text-sm mt-3 text-center px-6">
            Secure AI Permission Platform
          </Text>
        </View>
        <GradientButton
          title="Continue with Auth0"
          onPress={login}
          isLoading={isLoading}
          disabled={!isReady}
          icon={<Text className="text-lg mr-2">🔐</Text>}
          style={{ width: "80%", marginHorizontal: "auto" }}
        />

        {/* FOOTER */}
        <Text className="text-gray-500 text-xs text-center mt-6 leading-5">
          By continuing you agree to our{" "}
          <Text className="text-orange-400">Terms</Text> and{" "}
          <Text className="text-orange-400">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}
