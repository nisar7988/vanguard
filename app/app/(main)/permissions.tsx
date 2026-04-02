import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePermissions } from "@/src/hooks/use-permissions";
import { COLORS } from "@/src/constants/theme";

export default function PermissionsScreen() {
  const router = useRouter();
  const { permissions, loading, refreshing, onRefresh } = usePermissions();

  return (
    <ScrollView
      className="flex-1 bg-vanguard-background p-6"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <View className="flex-row items-center mb-8 mt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 w-10 h-10 bg-vanguard-card rounded-full items-center justify-center border border-vanguard-border shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-vanguard-text-primary">
          Permissions
        </Text>
      </View>

      {permissions.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Ionicons name="shield-outline" size={64} color={COLORS.primary} />
          <Text className="text-vanguard-text-primary font-bold text-xl mt-4">
            No Special Permissions
          </Text>
          <Text className="text-vanguard-text-secondary text-center mt-2">
            You haven't set any "Always Allow" rules yet.
          </Text>
        </View>
      ) : (
        permissions.map((permission) => (
          <View
            key={permission.id}
            className="bg-vanguard-card p-5 rounded-3xl mb-4 flex-row items-center border border-vanguard-border shadow-sm"
          >
            <View className="w-10 h-10 bg-vanguard-success/10 rounded-xl items-center justify-center mr-4">
              <Ionicons name="mail" size={20} color={COLORS.success} />
            </View>
            <View className="flex-1">
              <Text className="text-vanguard-text-primary font-bold text-lg">
                Send Email
              </Text>
              <Text className="text-vanguard-text-secondary text-xs">
                Target: {permission.target}
              </Text>
            </View>
            <View className="bg-vanguard-success/10 px-3 py-1 rounded-full border border-vanguard-success/30">
              <Text className="text-vanguard-success text-[10px] font-bold uppercase">
                Always Allow
              </Text>
            </View>
          </View>
        ))
      )}

      <Text className="text-vanguard-text-secondary text-center text-xs mt-8 px-6">
        Permissions are automatically created when you select "Always Allow" on
        a request.
      </Text>
    </ScrollView>
  );
}
