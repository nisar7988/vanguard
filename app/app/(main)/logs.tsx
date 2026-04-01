import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLogs } from '@/src/hooks/use-logs';
import { Log } from '@/src/api/agent-api';
import { COLORS } from '@/src/constants/theme';

// ─── Filter Tab Config ─────────────────────────────────────────────────────
type FilterKey = 'all' | 'success' | 'denied' | 'pending';

const FILTER_TABS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'all',     label: 'All',      icon: 'list-outline' },
  { key: 'success', label: 'Approved', icon: 'checkmark-circle-outline' },
  { key: 'denied',  label: 'Denied',   icon: 'close-circle-outline' },
  { key: 'pending', label: 'Pending',  icon: 'time-outline' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
const getStatusColor = (status: Log['status']) => {
  switch (status) {
    case 'success': return COLORS.success;
    case 'denied':  return COLORS.danger;
    case 'pending': return COLORS.warning;
    default:        return COLORS.primary;
  }
};

const getStatusBg = (status: Log['status']) => {
  switch (status) {
    case 'success': return 'bg-vanguard-success/10';
    case 'denied':  return 'bg-vanguard-danger/10';
    case 'pending': return 'bg-vanguard-warning/10';
    default:        return 'bg-vanguard-primary/10';
  }
};

const getStatusIcon = (status: Log['status']) => {
  switch (status) {
    case 'success': return 'checkmark-circle' as const;
    case 'denied':  return 'close-circle' as const;
    case 'pending': return 'time' as const;
    default:        return 'information-circle' as const;
  }
};

// ─── Main Screen ──────────────────────────────────────────────────────────
export default function LogsScreen() {
  const router = useRouter();
  const { logs, loading, refreshing, onRefresh } = useLogs();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredLogs = activeFilter === 'all'
    ? logs
    : logs.filter((log) => log.status.startsWith(activeFilter));

  return (
    <ScrollView
      className="flex-1 bg-vanguard-background"
      contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* ── Header ── */}
      <View className="flex-row items-center mb-6 mt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 w-10 h-10 bg-vanguard-card rounded-full items-center justify-center border border-vanguard-border shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-vanguard-text-primary">Activity Logs</Text>
      </View>

      {/* ── Filter Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginBottom: 20 }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          const tabColor = tab.key === 'success' ? COLORS.success
            : tab.key === 'denied'  ? COLORS.danger
            : tab.key === 'pending' ? COLORS.warning
            : COLORS.primary;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isActive ? `${tabColor}66` : `${COLORS.textSecondary}22`,
                backgroundColor: isActive ? `${tabColor}18` : 'transparent',
              }}
            >
              <Ionicons
                name={tab.icon as any}
                size={13}
                color={isActive ? tabColor : COLORS.textSecondary}
                style={{ marginRight: 5 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? tabColor : COLORS.textSecondary,
                }}
              >
                {tab.label}
              </Text>
              {tab.key !== 'all' && (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: isActive ? tabColor : COLORS.textSecondary,
                    marginLeft: 5,
                    opacity: 0.7,
                  }}
                >
                  {logs.filter((l) => l.status.startsWith(tab.key)).length}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Log List ── */}
      {loading && logs.length === 0 ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredLogs.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Ionicons name="list-outline" size={64} color={COLORS.slate400} />
          <Text className="text-vanguard-text-primary font-bold text-xl mt-4">
            {activeFilter === 'all' ? 'No activity yet' : `No ${activeFilter} entries`}
          </Text>
          <Text className="text-vanguard-text-secondary text-center mt-2">
            {activeFilter === 'all'
              ? 'All system events will appear here.'
              : `No ${activeFilter} events found.`}
          </Text>
        </View>
      ) : (
        filteredLogs.map((log) => {
          const actionTitle =
            log.action === 'execute_payment' ? 'Payment' :
            log.action === 'send_email'       ? 'Email'   :
            log.action === 'read_status'      ? 'Data Read' :
            log.action;

          const riskColor =
            log.riskLevel === 'high'   ? COLORS.danger        :
            log.riskLevel === 'medium' ? COLORS.warning       :
            log.riskLevel === 'low'    ? COLORS.success       :
            COLORS.textSecondary;

          const statusColor = getStatusColor(log.status);

          return (
            <View
              key={log.id}
              className="bg-vanguard-card p-5 rounded-3xl mb-4 border border-vanguard-border shadow-sm"
            >
              {/* ── Top row: icon + title + risk badge + status pill ── */}
              <View className="flex-row items-center mb-3">
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${getStatusBg(log.status)}`}>
                  <Ionicons name={getStatusIcon(log.status)} size={20} color={statusColor} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-vanguard-text-primary font-bold text-lg mr-2">{actionTitle}</Text>
                    {log.riskLevel && (
                      <View
                        className="px-2 py-0.5 rounded-md border"
                        style={{ borderColor: `${riskColor}44`, backgroundColor: `${riskColor}11` }}
                      >
                        <Text style={{ color: riskColor }} className="text-[8px] font-bold uppercase">
                          {log.riskLevel}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-vanguard-text-secondary text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <View className={`${getStatusBg(log.status)} px-3 py-1 rounded-full border border-vanguard-border/50`}>
                  <Text className="text-[10px] font-bold uppercase" style={{ color: statusColor }}>
                    {log.status === 'success' ? '✔ Success'
                      : log.status === 'denied' ? '❌ Denied'
                      : '⏳ Pending'}
                  </Text>
                </View>
              </View>

              {/* ── Source + Reason rows ── */}
              {(log.source || log.reason) && (
                <View
                  className="rounded-xl p-3 border border-vanguard-border/40"
                  style={{ backgroundColor: `${COLORS.primary}08` }}
                >
                  {log.source && (
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="hardware-chip-outline" size={11} color={COLORS.primary} style={{ marginRight: 5 }} />
                      <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mr-1">
                        Requested by:
                      </Text>
                      <Text className="text-vanguard-text-primary text-[11px] font-medium" style={{ fontStyle: 'italic' }}>
                        {log.source}
                      </Text>
                    </View>
                  )}
                  {log.reason && (
                    <View className="flex-row items-start">
                      <Ionicons name="information-circle-outline" size={11} color={COLORS.textSecondary} style={{ marginRight: 5, marginTop: 1 }} />
                      <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mr-1">
                        Reason:
                      </Text>
                      <Text className="text-vanguard-text-secondary text-[11px] flex-1" style={{ fontStyle: 'italic' }}>
                        {log.reason}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
