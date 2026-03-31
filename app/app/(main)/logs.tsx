import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLogs } from '@/src/hooks/use-logs';
import { Log } from '@/src/api/agent-api';
import { COLORS } from '@/src/constants/theme';

export default function LogsScreen() {
  const router = useRouter();
  const { logs, loading, refreshing, onRefresh } = useLogs();

  const getStatusColor = (status: Log['status']) => {
    switch (status) {
      case 'success': return COLORS.success;
      case 'denied': return COLORS.danger;
      case 'pending': return COLORS.warning;
      default: return COLORS.primary;
    }
  };

  const getStatusBg = (status: Log['status']) => {
    switch (status) {
      case 'success': return 'bg-vanguard-success/10';
      case 'denied': return 'bg-vanguard-danger/10';
      case 'pending': return 'bg-vanguard-warning/10';
      default: return 'bg-vanguard-primary/10';
    }
  };

  const getStatusIcon = (status: Log['status']) => {
    switch (status) {
      case 'success': return 'checkmark-circle';
      case 'denied': return 'close-circle';
      case 'pending': return 'time';
      default: return 'information-circle';
    }
  };

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
        <Text className="text-3xl font-bold text-vanguard-text-primary">Activity Logs</Text>
      </View>

      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : logs.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Ionicons name="list-outline" size={64} color={COLORS.slate400} />
          <Text className="text-vanguard-text-primary font-bold text-xl mt-4">No activity yet</Text>
          <Text className="text-vanguard-text-secondary text-center mt-2">All system events will appear here.</Text>
        </View>
      ) : (
        logs.map((log) => (
          <View key={log.id} className="bg-vanguard-card p-5 rounded-3xl mb-4 flex-row items-center border border-vanguard-border shadow-sm">
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${getStatusBg(log.status)}`}>
              <Ionicons name={getStatusIcon(log.status)} size={20} color={getStatusColor(log.status)} />
            </View>
            <View className="flex-1">
              <Text className="text-vanguard-text-primary font-bold text-lg">{log.action === 'send_email' ? 'Email Sent' : log.action}</Text>
              <Text className="text-vanguard-text-secondary text-xs">{new Date(log.timestamp).toLocaleTimeString()}</Text>
            </View>
            <View className={`${getStatusBg(log.status)} px-3 py-1 rounded-full border border-vanguard-border/50`}>
              <Text className="text-[10px] font-bold uppercase" style={{ color: getStatusColor(log.status) }}>
                {log.status === 'success' ? '✔ Success' : log.status === 'denied' ? '❌ Denied' : 'Pending'}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
