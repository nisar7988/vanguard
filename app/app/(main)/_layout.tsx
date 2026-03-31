import { CustomTabBar } from "@/src/components/custom-tab-bar";
import { useAuthStore } from "@/src/store/use-auth-store";
import { Redirect, Tabs } from "expo-router";

export default function MainLayout() {
  const { token } = useAuthStore();

  if (!token) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="requests" options={{ href: null }} />
      <Tabs.Screen name="permissions" options={{ href: null }} />
      <Tabs.Screen name="logs" />
      <Tabs.Screen name="services" options={{ href: null }} />
    </Tabs>
  );
}
