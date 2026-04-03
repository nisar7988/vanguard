import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useLogs } from "@/src/hooks/use-logs";
import { Log } from "@/src/api/agent-api";
import { COLORS } from "@/src/constants/theme";

type FilterKey = "all" | "success" | "denied" | "pending";

const FILTER_TABS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "list-outline" },
  { key: "success", label: "Approved", icon: "checkmark-circle-outline" },
  { key: "denied", label: "Denied", icon: "close-circle-outline" },
  { key: "pending", label: "Pending", icon: "time-outline" },
];

const getStatusColor = (status: Log["status"]) => {
  switch (status) {
    case "success":
      return COLORS.success;
    case "denied":
      return COLORS.danger;
    case "pending":
      return COLORS.warning;
    default:
      return COLORS.primary;
  }
};

const getStatusLabel = (status: Log["status"]) => {
  switch (status) {
    case "success":
      return "Approved";
    case "denied":
      return "Denied";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

export default function LogsScreen() {
  const router = useRouter();
  const { logs, loading, refreshing, onRefresh } = useLogs();

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    let result = logs;

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter((log) => log.status.startsWith(activeFilter));
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (log) =>
          log.action?.toLowerCase().includes(q) ||
          log.reason?.toLowerCase().includes(q) ||
          log.source?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [logs, activeFilter, searchQuery]);

  const renderLogItem = ({ item: log }: { item: Log }) => {
    const statusColor = getStatusColor(log.status);
    const actionTitle =
      log.action === "execute_payment"
        ? "Payment Execution"
        : log.action === "send_email"
          ? "Email Sent"
          : log.action === "read_status"
            ? "Status Check"
            : log.action?.replace(/_/g, " ") || "Activity";

    const risk = log.riskLevel
      ? {
          high: {
            text: "High Risk",
            color: COLORS.danger,
            bg: `${COLORS.danger}15`,
          },
          medium: {
            text: "Medium Risk",
            color: COLORS.warning,
            bg: `${COLORS.warning}15`,
          },
          low: {
            text: "Low Risk",
            color: COLORS.success,
            bg: `${COLORS.success}15`,
          },
        }[log.riskLevel]
      : null;

    return (
      <View className="mb-4 px-1">
        <View className="bg-vanguard-card rounded-3xl overflow-hidden border border-vanguard-border shadow-sm">
          {/* Accent Bar */}
          <View style={{ height: 4, backgroundColor: statusColor }} />

          <View className="p-5">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
              <Text className="text-vanguard-text-primary font-semibold text-[17px] flex-1 pr-2">
                {actionTitle}
              </Text>

              <View className="flex-row items-center gap-1.5">
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: statusColor,
                  }}
                />
                <Text
                  style={{
                    color: statusColor,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {getStatusLabel(log.status)}
                </Text>
              </View>
            </View>

            {/* Meta */}
            <View className="flex-row items-center mb-2">
              {log.source && (
                <Text className="text-white text-sm">by {log.source}</Text>
              )}
              <Text className="text-vanguard-text-secondary text-sm mx-2">
                •
              </Text>
              <Text className="text-vanguard-text-secondary text-sm">
                {new Date(log.timestamp).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            {/* Reason */}
            {log.reason && (
              <Text className="text-vanguard-text-secondary text-sm mb-4">
                {log.reason}
              </Text>
            )}

            {/* Risk Badge */}
            {risk && (
              <View
                className="self-start px-3 py-1 rounded-full"
                style={{ backgroundColor: risk.bg }}
              >
                <Text
                  style={{ color: risk.color, fontSize: 12, fontWeight: "600" }}
                >
                  {risk.text}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-vanguard-background pb-12">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-12 pb-4 bg-vanguard-background">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 w-10 h-10 bg-vanguard-card rounded-2xl items-center justify-center border border-vanguard-border"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-vanguard-text-primary flex-1">
          Activity Logs
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="bg-vanguard-card flex-row items-center px-4 rounded-2xl border border-vanguard-border">
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            className="flex-1 ml-3 py-3 text-vanguard-text-primary text-base"
            placeholder="Search logs..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-6 mb-5">
        <FlashList
          data={FILTER_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24 }}
          renderItem={({ item: tab }) => {
            const isActive = activeFilter === tab.key;
            const color =
              tab.key === "success"
                ? COLORS.success
                : tab.key === "denied"
                  ? COLORS.danger
                  : tab.key === "pending"
                    ? COLORS.warning
                    : COLORS.primary;

            const count =
              tab.key === "all"
                ? logs.length
                : logs.filter((l) => l.status.startsWith(tab.key)).length;

            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(tab.key)}
                className={`flex-row items-center px-5 py-2.5 rounded-3xl mr-3 border ${
                  isActive ? "border-opacity-30" : "border-transparent"
                }`}
                style={{
                  backgroundColor: isActive ? `${color}15` : "transparent",
                  borderColor: isActive ? `${color}60` : undefined,
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? color : COLORS.textSecondary}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${isActive ? "font-semibold" : ""}`}
                  style={{ color: isActive ? color : COLORS.textSecondary }}
                >
                  {tab.label}
                </Text>
                <Text
                  className="ml-1.5 text-xs font-bold opacity-70"
                  style={{ color: isActive ? color : COLORS.textSecondary }}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Logs List */}
      <View className="flex-1">
        {loading && logs.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filteredLogs.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10">
            <Ionicons
              name="document-text-outline"
              size={72}
              color={COLORS.slate400}
            />
            <Text className="text-vanguard-text-primary text-2xl font-semibold mt-6 text-center">
              {searchQuery
                ? "No matching logs"
                : activeFilter === "all"
                  ? "No activity yet"
                  : `No ${activeFilter} logs`}
            </Text>
            <Text className="text-vanguard-text-secondary text-center mt-3 leading-5">
              {searchQuery
                ? "Try changing your search term"
                : activeFilter === "all"
                  ? "All your system activity will appear here"
                  : `No ${activeFilter} events found in this period.`}
            </Text>
          </View>
        ) : (
          <FlashList
            data={filteredLogs}
            renderItem={renderLogItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
}
