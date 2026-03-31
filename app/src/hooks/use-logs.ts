import { agentApi, Log } from "@/src/api/agent-api";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await agentApi.getLogs();
      setLogs(response.data);
    } catch (error: any) {
      console.error("Failed to fetch logs:", error.message || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [fetchLogs]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refreshing,
    refresh: fetchLogs,
    onRefresh,
  };
}
