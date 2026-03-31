import { useState, useEffect, useCallback } from 'react';
import { agentApi, Permission } from '@/src/api/agent-api';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await agentApi.getPermissions();
      setPermissions(response.data);
    } catch (error: any) {

      console.error('Failed to fetch permissions:', error.message || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    loading,
    refreshing,
    refresh: fetchPermissions,
    onRefresh,
  };
}
