import { useCallback } from 'react';
import { agentApi } from '@/src/api/agent-api';
import { useAuthStore } from '@/src/store/use-auth-store';
import { useAlertStore } from '@/src/store/use-alert-store';

export function useDashboardActions() {
  const { isConnected, setConnected } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  const handleConnectGmail = useCallback(() => {
    showAlert(
      'Connect Gmail',
      'This would typically redirect to Auth0 for OAuth. Connect your account now?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Connect',
          onPress: () => setConnected(true),
        },
      ]
    );
  }, [setConnected, showAlert]);

  const handleSimulateRequest = useCallback(async () => {
    try {
      const response = await agentApi.simulateRequest({
        action: 'send_email',
        to: 'team@mail.com',
        message: 'Meeting at 5',
      });
      showAlert('Success', response.message || 'AI Request simulated successfully!');

    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to simulate AI request. Check if backend is running.');
    }

  }, [showAlert]);

  return {
    isConnected,
    handleConnectGmail,
    handleSimulateRequest,
  };
}
