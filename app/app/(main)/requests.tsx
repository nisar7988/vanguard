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
import { useRequests } from '@/src/hooks/use-requests';
import { COLORS } from '@/src/constants/theme';

// ─── Flow Indicator ───────────────────────────────────────────────────────────
type FlowStep = { label: string; icon: string };
const FLOW_STEPS: FlowStep[] = [
  { label: 'AI',       icon: '🤖' },
  { label: 'Vanguard', icon: '🛡️' },
  { label: 'You',      icon: '👤' },
  { label: 'Approved', icon: '✅' },
  { label: 'Executed', icon: '⚡' },
];

function FlowIndicator({ activeIndex = 2 }: { activeIndex?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 2, marginBottom: 20 }}>
      {FLOW_STEPS.map((step, i) => {
        const isActive  = i === activeIndex;
        const isDone    = i < activeIndex;
        const isFuture  = i > activeIndex;

        const textColor = isDone
          ? COLORS.success
          : isActive
          ? COLORS.primary
          : COLORS.textSecondary;

        const bgColor = isDone
          ? `${COLORS.success}18`
          : isActive
          ? `${COLORS.primary}22`
          : 'transparent';

        return (
          <View key={step.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: bgColor,
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderWidth: isActive ? 1 : 0,
                borderColor: `${COLORS.primary}44`,
              }}
            >
              <Text style={{ fontSize: 10, marginRight: 3 }}>{step.icon}</Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? '700' : '500',
                  color: textColor,
                  opacity: isFuture ? 0.45 : 1,
                }}
              >
                {step.label}
              </Text>
            </View>
            {i < FLOW_STEPS.length - 1 && (
              <Text style={{ color: COLORS.textSecondary, fontSize: 9, marginHorizontal: 2, opacity: 0.5 }}>
                →
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RequestsScreen() {
  const router = useRouter();
  const { requests, loading, refreshing, onRefresh, handleAction } = useRequests();

  return (
    <ScrollView
      className="flex-1 bg-vanguard-background"
      contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* ── Header ── */}
      <View className="flex-row items-center mb-2 mt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 w-10 h-10 bg-vanguard-card rounded-full items-center justify-center border border-vanguard-border shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-vanguard-text-primary">Requests</Text>

        {/* Pending Approval pill */}
        {requests.length > 0 && (
          <View
            className="ml-3 flex-row items-center px-3 py-1 rounded-full"
            style={{ backgroundColor: `${COLORS.warning}22`, borderWidth: 1, borderColor: `${COLORS.warning}55` }}
          >
            <Ionicons name="time-outline" size={11} color={COLORS.warning} style={{ marginRight: 4 }} />
            <Text style={{ color: COLORS.warning, fontSize: 10, fontWeight: '700' }}>
              PENDING APPROVAL
            </Text>
          </View>
        )}
      </View>

      <Text className="text-vanguard-text-secondary text-sm mb-8">
        Review AI-initiated actions before they execute.
      </Text>

      {loading && requests.length === 0 ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : requests.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.success} />
          <Text className="text-vanguard-text-primary font-bold text-xl mt-4">All Clear!</Text>
          <Text className="text-vanguard-text-secondary text-center mt-2">
            No pending requests at the moment.
          </Text>
        </View>
      ) : (
        requests.map((request) => {
          const riskColor =
            request.riskLevel === 'high'   ? COLORS.danger  :
            request.riskLevel === 'medium' ? COLORS.warning :
            COLORS.success;

          const iconName =
            request.action === 'execute_payment' ? 'card-outline' :
            request.action === 'send_email'       ? 'mail-outline' :
            'eye-outline';

          const actionTitle =
            request.action === 'execute_payment' ? 'Execute Payment' :
            request.action === 'send_email'       ? 'Send Email' :
            'Read Data';

          const actionType =
            request.action === 'execute_payment' ? 'Financial Transaction' :
            request.action === 'send_email'       ? 'External Email' :
            'Data Read';

          return (
            <View
              key={request.id}
              className="bg-vanguard-card p-6 rounded-3xl mb-4 border shadow-sm"
              style={{ borderColor: `${riskColor}33` }}
            >
              {/* ── Card Header ── */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${riskColor}22` }}
                  >
                    <Ionicons name={iconName} size={20} color={riskColor} />
                  </View>
                  <View>
                    <Text className="text-vanguard-text-primary font-bold text-lg">{actionTitle}</Text>
                    <Text className="text-vanguard-text-secondary text-[10px]">
                      {new Date(request.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View
                  className="px-3 py-1 rounded-full border"
                  style={{ backgroundColor: `${riskColor}11`, borderColor: `${riskColor}44` }}
                >
                  <Text style={{ color: riskColor }} className="text-[10px] font-bold uppercase">
                    {request.riskLevel} Risk
                  </Text>
                </View>
              </View>

              {/* ── Detail Block ── */}
              <View className="bg-vanguard-background p-4 rounded-2xl mb-4 border border-vanguard-border/50">
                <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mb-1">Target</Text>
                <Text className="text-vanguard-text-primary mb-3 font-medium text-sm">{request.target}</Text>

                <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mb-1">Content</Text>
                <Text className="text-vanguard-text-primary font-medium text-sm mb-3">{request.content}</Text>

                {/* Type row */}
                <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mb-1">Type</Text>
                <Text className="text-vanguard-text-primary font-medium text-sm mb-3">{actionType}</Text>

                {/* Source row */}
                <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mb-1">
                  Requested By
                </Text>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="hardware-chip-outline" size={13} color={COLORS.primary} style={{ marginRight: 5 }} />
                  <Text className="text-vanguard-text-primary font-medium text-sm" style={{ fontStyle: 'italic' }}>
                    {request.source ?? 'AI Agent'}
                  </Text>
                </View>
                {/* Vault footnote */}
                <View className="flex-row items-center mb-3">
                  <Ionicons name="lock-closed-outline" size={10} color={COLORS.success} style={{ marginRight: 4 }} />
                  <Text style={{ color: COLORS.success, fontSize: 10, fontStyle: 'italic', opacity: 0.85 }}>
                    Token retrieved securely via Vault
                  </Text>
                </View>

                {/* Reason row */}
                {request.reason && (
                  <>
                    <Text className="text-vanguard-text-secondary text-[10px] font-bold uppercase mb-1">Reason</Text>
                    <Text className="text-vanguard-text-primary font-medium text-sm" style={{ fontStyle: 'italic' }}>
                      {request.reason}
                    </Text>
                  </>
                )}
              </View>

              {/* ── AI Flow Indicator ── */}
              <FlowIndicator activeIndex={2} />

              {/* ── Action Buttons ── */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleAction(request.id, 'once')}
                  className="bg-vanguard-primary px-4 py-3 rounded-xl items-center"
                  style={{ flex: 1 }}
                >
                  <Text className="text-white font-bold">Allow Once</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAction(request.id, 'always')}
                  className="bg-vanguard-success px-4 py-3 rounded-xl items-center"
                  style={{ flex: 1 }}
                >
                  <Text className="text-white font-bold">Always Allow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAction(request.id, 'deny')}
                  className="bg-vanguard-danger px-4 py-3 rounded-xl items-center"
                  style={{ flex: 1 }}
                >
                  <Text className="text-white font-bold">Deny</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
