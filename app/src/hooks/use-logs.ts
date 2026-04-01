import { agentApi, Log } from "@/src/api/agent-api";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";

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

  // Poll for updates every 5 seconds for "real-time" feel
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

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
