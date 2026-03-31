export interface AgentRequest {
  id: string;
  userId: string;
  action: string;
  to: string;
  message: string;
  status: 'pending' | 'approved' | 'denied';
  requiresStepUp?: boolean;
  createdAt: Date;
}
