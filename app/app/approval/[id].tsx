import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ApprovalScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-vanguard-background p-6">
      <Text className="text-2xl font-bold mb-4 text-vanguard-text-primary">
        Request Approval
      </Text>
      <Text className="text-vanguard-text-secondary">Action ID: {id}</Text>
    </View>
  );
}
