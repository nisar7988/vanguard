import { ThemedGradient } from "@/src/components/themed-gradient";
import { COLORS } from "@/src/constants/theme";
import { useAuth0Login } from "@/src/hooks/use-auth0-login";
import { useDashboardActions } from "@/src/hooks/use-dashboard-actions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  const { logout } = useAuth0Login();
  const router = useRouter();
  const { isConnected, handleConnectGmail, handleSimulateRequest } =
    useDashboardActions();

  return (
    <ScrollView className="flex-1 bg-vanguard-background p-6">
      <View className="flex-row justify-between items-center mb-8 mt-12">
        <View>
          <Text className="text-vanguard-primary text-sm font-bold uppercase tracking-widest">
            Vanguard
          </Text>
          <Text className="text-3xl font-bold text-vanguard-text-primary">
            Dashboard
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="bg-vanguard-card p-3 rounded-full border border-vanguard-border shadow-sm"
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Actions */}
      <View className="flex-row flex-wrap justify-between">
        <TouchableOpacity
          onPress={handleConnectGmail}
          className="w-[48%] bg-vanguard-card p-6 rounded-3xl mb-4 border border-vanguard-border shadow-sm"
        >
          <ThemedGradient
            className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
            type={isConnected ? "primary" : "primary"} // Keep it orange for now or add a success gradient?
            disabled={isConnected} // If connected, maybe use a disabled look or success?
          >
            <Ionicons name="link" size={24} color={COLORS.white} />
          </ThemedGradient>
          <Text className="text-vanguard-text-primary font-bold text-lg">
            {isConnected ? "Connected" : "Connect"}
          </Text>
          <Text className="text-vanguard-text-secondary text-xs mt-1">
            Gmail Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSimulateRequest}
          className="w-[48%] bg-vanguard-card p-6 rounded-3xl mb-4 border border-vanguard-border shadow-sm"
        >
          <ThemedGradient className="w-12 h-12 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="flash" size={24} color={COLORS.white} />
          </ThemedGradient>
          <Text className="text-vanguard-text-primary font-bold text-lg">
            Simulate
          </Text>
          <Text className="text-vanguard-text-secondary text-xs mt-1">
            AI Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Management Sections */}
      <Text className="text-vanguard-text-secondary font-bold uppercase tracking-widest text-xs mt-4 mb-4">
        Management
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(main)/requests")}
        className="bg-vanguard-card p-5 rounded-3xl mb-4 flex-row items-center border border-vanguard-border shadow-sm"
      >
        <ThemedGradient
          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="notifications" size={20} color={COLORS.white} />
        </ThemedGradient>
        <View className="flex-1">
          <Text className="text-vanguard-text-primary font-bold text-lg">
            Pending Requests
          </Text>
          <Text className="text-vanguard-text-secondary text-xs">
            Review and approve actions
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(main)/logs")}
        className="bg-vanguard-card p-5 rounded-3xl mb-4 flex-row items-center border border-vanguard-border shadow-sm"
      >
        <ThemedGradient
          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="list" size={20} color={COLORS.white} />
        </ThemedGradient>
        <View className="flex-1">
          <Text className="text-vanguard-text-primary font-bold text-lg">
            Activity Logs
          </Text>
          <Text className="text-vanguard-text-secondary text-xs">
            Track system events
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(main)/permissions")}
        className="bg-vanguard-card p-5 rounded-3xl mb-4 flex-row items-center border border-vanguard-border shadow-sm"
      >
        <View className="w-10 h-10 bg-vanguard-success/10 rounded-xl items-center justify-center mr-4">
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
        </View>
        <View className="flex-1">
          <Text className="text-vanguard-text-primary font-bold text-lg">
            Permissions
          </Text>
          <Text className="text-vanguard-text-secondary text-xs">
            Manage access rules
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </ScrollView>
  );
}
