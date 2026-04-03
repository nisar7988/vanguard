import { ThemedGradient } from "@/src/components/themed-gradient";
import { COLORS } from "@/src/constants/theme";
import { useAuth0Login } from "@/src/hooks/use-auth0-login";
import { useDashboardActions } from "@/src/hooks/use-dashboard-actions";
import { useRequests } from "@/src/hooks/use-requests";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { logout } = useAuth0Login();
  const router = useRouter();
  const { isConnected, handleConnectGmail, handleSimulateRequest } =
    useDashboardActions();
  const { requests } = useRequests();
  const pendingCount = requests.length;

  return (
    <View className="flex-1  ">
      <ScrollView
        className="flex-1 bg-vanguard-background pt-3"
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
      >
        <View className="flex-row justify-between items-center mb-8">
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

        {/* AI Agent Simulation Center */}
        <Text className="text-vanguard-text-secondary font-bold uppercase tracking-widest text-xs mt-4 mb-4">
          AI Agent Simulation
        </Text>

        <View className="bg-vanguard-card p-6 rounded-3xl mb-8 border border-vanguard-border shadow-sm">
          <Text className="text-vanguard-text-primary font-bold text-lg mb-2">
            Simulate AI Actions
          </Text>
          <Text className="text-vanguard-text-secondary text-xs mb-6">
            Test how Vanguard handles actions based on real-time risk
            assessment.
          </Text>

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={() => handleSimulateRequest("read_status")}
              disabled={!isConnected}
              style={{ opacity: isConnected ? 1 : 0.5 }}
              className="flex-1 bg-vanguard-background p-4 rounded-2xl mr-2 items-center border border-vanguard-border/50"
            >
              <View className="w-10 h-10 bg-emerald-500/10 rounded-full  items-center justify-center mb-2">
                <Ionicons name="eye-outline" size={20} color="#10B981" />
              </View>
              <Text className="text-vanguard-text-primary font-bold text-xs">
                Read Data
              </Text>
              <Text className="text-emerald-500 text-[10px] font-bold uppercase mt-1">
                Low Risk
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSimulateRequest("send_email")}
              disabled={!isConnected}
              style={{ opacity: isConnected ? 1 : 0.5 }}
              className="flex-1 bg-vanguard-background p-4 rounded-2xl mx-1 items-center border border-vanguard-border/50"
            >
              <View className="w-10 h-10 bg-amber-500/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="mail-outline" size={20} color="#F59E0B" />
              </View>
              <Text className="text-vanguard-text-primary font-bold text-xs">
                Send Email
              </Text>
              <Text className="text-amber-500 text-[9px] font-bold uppercase mt-1">
                Medium Risk
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSimulateRequest("execute_payment")}
              disabled={!isConnected}
              style={{ opacity: isConnected ? 1 : 0.5 }}
              className="flex-1 bg-vanguard-background p-4 rounded-2xl ml-2 items-center border border-vanguard-border/50"
            >
              <View className="w-10 h-10 bg-rose-500/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="card-outline" size={20} color="#EF4444" />
              </View>
              <Text className="text-vanguard-text-primary font-bold text-xs">
                Payment
              </Text>
              <Text className="text-rose-500 text-[10px] font-bold uppercase mt-1">
                High Risk
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleConnectGmail}
            className="bg-vanguard-primary/10 py-3 rounded-2xl flex-row items-center justify-center border border-vanguard-primary/20"
          >
            <Ionicons
              name={isConnected ? "checkmark-circle" : "link"}
              size={18}
              color={COLORS.primary}
              className="mr-2"
            />
            <Text className="text-vanguard-primary font-bold ml-2">
              {isConnected ? "Gmail Authorized" : "Authorize Gmail Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Management Sections */}
        <View className="flex-row justify-between items-center mt-4 mb-4">
          <Text className="text-vanguard-text-secondary font-bold uppercase tracking-widest text-xs">
            Management
          </Text>
          <Text className="text-vanguard-primary/80 text-[10px] font-medium italic">
            User is notified when action requires approval
          </Text>
        </View>

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
            <View className="flex-row items-center">
              <Text className="text-vanguard-text-primary font-bold text-lg">
                Pending Requests
              </Text>
              {pendingCount > 0 && (
                <View className="bg-vanguard-primary px-2 py-0.5 rounded-full ml-2">
                  <Text className="text-white text-[10px] font-bold">
                    {pendingCount}
                  </Text>
                </View>
              )}
            </View>
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
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={COLORS.success}
            />
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
    </View>
  );
}
