import { useCallback } from 'react';
import { agentApi } from '@/src/api/agent-api';
import { useAuthStore } from '@/src/store/use-auth-store';
import { useAlertStore } from '@/src/store/use-alert-store';
import { useToast } from '@/src/components/ui/toast-provider';
import { useRouter } from 'expo-router';

export function useDashboardActions() {
  const { isConnected, setConnected } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);
  const { showToast } = useToast();
  const router = useRouter();

  const handleConnectGmail = useCallback(() => {
    if (isConnected) return;
    
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
          onPress: () => {
            setConnected(true);
            showToast({ message: 'Gmail Authorized Successfully', type: 'success' });
          },
        },
      ]
    );
  }, [isConnected, setConnected, showAlert, showToast]);

  const handleSimulateRequest = useCallback(async (actionType: string = 'send_email') => {
    if (!isConnected) {
      showToast({ 
        message: 'Please authorize Gmail Account to begin simulations', 
        type: 'warning' 
      });
      return;
    }

    showToast({ 
      message: 'New request received', 
      type: 'info' 
    });
    
    try {
      const payloads: Record<string, any> = {
        read_status: { action: 'read_status', target: 'system_logs', content: 'Fetch status' },
        send_email: { action: 'send_email', target: 'client@example.com', content: 'Invoice details' },
        execute_payment: { action: 'execute_payment', target: 'vendor_acct_99', content: '$500.00' },
      };

      const payload = payloads[actionType] || payloads.send_email;
      const response = await agentApi.simulateRequest(payload);
      const result = response.data;
      
      if (result.status === 'executed') {
        showToast({ 
          message: `Vanguard: Action "${actionType}" auto-executed (Low Risk)`, 
          type: 'success' 
        });
      } else if (result.status === 'pending_approval' || result.status === 'pending_step_up') {
        showToast({ 
          message: 'Vanguard: Authorization Required for this action', 
          type: 'warning' 
        });
        // Optional: auto-navigate to requests
        setTimeout(() => router.push('/(main)/requests'), 1500);
      } else {
        showAlert('Simulation Result', result.message || 'AI Request simulated');
      }

    } catch (error: any) {
      showToast({ 
        message: error.message || 'Failed to simulate AI request', 
        type: 'error' 
      });
    }

  }, [showAlert, showToast, router]);

  return {
    isConnected,
    handleConnectGmail,
    handleSimulateRequest,
  };
}
