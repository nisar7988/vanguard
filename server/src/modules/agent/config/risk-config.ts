export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ActionRisk {
  action: string;
  level: RiskLevel;
}

export const ACTION_RISK_MAPPING: Record<string, RiskLevel> = {
  read_status: RiskLevel.LOW,
  list_logs: RiskLevel.LOW,
  send_email: RiskLevel.MEDIUM,
  create_contact: RiskLevel.MEDIUM,
  delete_account: RiskLevel.HIGH,
  reset_password: RiskLevel.HIGH,
  execute_payment: RiskLevel.HIGH,
};

export const getRiskLevel = (action: string): RiskLevel => {
  return ACTION_RISK_MAPPING[action] || RiskLevel.MEDIUM; // Default to medium if unknown
};
