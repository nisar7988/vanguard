import { API_Response } from "../types/api-response";
import apiClient from "./api-client";

export interface AgentRequest {
  id: string;
  action: string;
  target: string;
  content: string;
  status: "pending" | "approved" | "denied";
  riskLevel: "low" | "medium" | "high";
  reason?: string;
  source?: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  action: string;
  target: string;
  status: "always_allow" | "ask_once" | "deny";
}

export interface Log {
  id: string;
  action: string;
  status: "success" | "denied" | "pending";
  riskLevel?: string;
  reason?: string;
  source?: string;
  timestamp: string;
}

export const agentApi = {
  getRequests: async () => {
    const response = await apiClient.get<API_Response<AgentRequest[]>>("/v1/agent/requests");
    return response.data;
  },

  approveRequest: async (requestId: string, decision: "allow_once" | "allow_always" | "deny") => {
    const response = await apiClient.post<API_Response<any>>("/v1/agent/approve", {
      requestId,
      decision,
    });
    return response.data;
  },

  getPermissions: async () => {
    const response = await apiClient.get<API_Response<Permission[]>>("/v1/permissions");
    return response.data;
  },

  getLogs: async () => {
    const response = await apiClient.get<API_Response<Log[]>>("/v1/logs");
    return response.data;
  },

  simulateRequest: async (data: {
    action: string;
    target: string;
    content: string;
  }) => {
    const response = await apiClient.post<API_Response<any>>("/v1/agent/request-action", data);
    return response.data;
  },
};


