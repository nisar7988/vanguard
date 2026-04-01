export interface AgentRequest {
  id: string;
  userId: string;
  action: string;
  target: string;
  content: string;
  status: 'pending' | 'approved' | 'denied';
  riskLevel: string;
  requiresStepUp?: boolean;
  reason?: string;
  source?: string;
  createdAt: Date;
}
