import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRequests } from '@/src/hooks/use-requests';
import { COLORS } from '@/src/constants/theme';

export default function RequestsScreen() {
  const router = useRouter();
  const { requests, loading, refreshing, onRefresh, handleAction } = useRequests();

  if (loading) {
    return (
      <View className="flex-1 bg-vanguard-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-vanguard-background p-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      <View className="flex-row items-center mb-8 mt-12">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4 w-10 h-10 bg-vanguard-card rounded-full items-center justify-center border border-vanguard-border shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-vanguard-text-primary">Pending</Text>
      </View>

      {requests.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.success} />
          <Text className="text-vanguard-text-primary font-bold text-xl mt-4">All Clear!</Text>
          <Text className="text-vanguard-text-secondary text-center mt-2">No pending requests at the moment.</Text>
        </View>
      ) : (
        requests.map((request) => (
          <View key={request.id} className="bg-vanguard-card p-6 rounded-3xl mb-4 border border-vanguard-border shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-vanguard-primary/10 rounded-xl items-center justify-center mr-3">
                <Ionicons name="mail" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text className="text-vanguard-text-primary font-bold text-lg">Action: Send Email</Text>
                <Text className="text-vanguard-text-secondary text-xs">{new Date(request.createdAt).toLocaleString()}</Text>
              </View>
            </View>

            <View className="bg-vanguard-background p-4 rounded-2xl mb-6 border border-vanguard-border/50">
              <Text className="text-vanguard-text-secondary text-xs font-bold uppercase mb-1">To</Text>
              <Text className="text-vanguard-text-primary mb-3 font-medium">{request.to}</Text>
              <Text className="text-vanguard-text-secondary text-xs font-bold uppercase mb-1">Message</Text>
              <Text className="text-vanguard-text-primary font-medium">{request.message}</Text>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity 
                onPress={() => handleAction(request.id, 'once')}
                className="bg-vanguard-primary px-4 py-3 rounded-xl flex-1 mr-2 items-center"
              >
                <Text className="text-white font-bold">Allow Once</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleAction(request.id, 'always')}
                className="bg-vanguard-success px-4 py-3 rounded-xl flex-1 mx-1 items-center"
              >
                <Text className="text-white font-bold">Always</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleAction(request.id, 'deny')}
                className="bg-vanguard-danger px-4 py-3 rounded-xl flex-1 ml-2 items-center"
              >
                <Text className="text-white font-bold">Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
