import { useState, useEffect, useCallback } from "react";
import { agentApi, AgentRequest } from "@/src/api/agent-api";

export function useRequests() {
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async (isAuto = false) => {
    try {
      if (!isAuto) setLoading(true);
      const response = await agentApi.getRequests();
      // Only show pending requests in the requests screen
      setRequests(
        response.data.filter((r: AgentRequest) => r.status === "pending"),
      );
    } catch (error: any) {
      console.error("Failed to fetch requests:", error.message || error);
    } finally {
      if (!isAuto) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Poll for updates every 3 seconds for "real-time" feel
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRequests(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = useCallback(
    async (requestId: string, mode: "once" | "always" | "deny") => {
      try {
        const decisionMap: Record<
          "once" | "always" | "deny",
          "allow_once" | "allow_always" | "deny"
        > = {
          once: "allow_once",
          always: "allow_always",
          deny: "deny",
        };

        await agentApi.approveRequest(requestId, decisionMap[mode]);

        // Remove from list locally for immediate feedback
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      } catch (error: any) {
        console.error("Failed to process request:", error.message || error);
        throw error;
      }
    },
    [],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    refreshing,
    refresh: fetchRequests,
    onRefresh,
    handleAction,
  };
}
