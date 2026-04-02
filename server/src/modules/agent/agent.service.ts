import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAgentRequestDto } from './dto/create-agent-request.dto';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { AgentRequest } from './interfaces/agent.interface';
import { LogsService } from '../logs/logs.service';
import { PermissionsService } from '../permissions/permissions.service';
import { ActionsService } from '../actions/actions.service';
import { RiskLevel, getRiskLevel } from './config/risk-config';
import { StorageService } from '../../core/storage/storage.service';

const AGENT_SOURCE = 'AI Agent (OpenClaw)';

function buildReason(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.HIGH:
      return 'High-value transaction requires user approval';
    case RiskLevel.MEDIUM:
      return 'Sensitive action requires one-time user authorization';
    case RiskLevel.LOW:
    default:
      return 'Low-risk action auto-executed by policy';
  }
}

@Injectable()
export class AgentService {
  private pendingRequests: AgentRequest[] = [];
  private readonly STORAGE_KEY = 'pending_requests';

  constructor(
    private readonly logsService: LogsService,
    private readonly permissionsService: PermissionsService,
    private readonly actionsService: ActionsService,
    private readonly storageService: StorageService,
  ) {
    this.pendingRequests =
      this.storageService.load<AgentRequest[]>(this.STORAGE_KEY) || [];
  }

  private saveToStorage() {
    this.storageService.save(this.STORAGE_KEY, this.pendingRequests);
  }

  async handleRequest(dto: CreateAgentRequestDto, userId: string) {
    const riskLevel = getRiskLevel(dto.action);
    const reason = buildReason(riskLevel);

    // 1. Check if it's LOW risk (Auto-execute)
    if (riskLevel === RiskLevel.LOW) {
      const executionResult = await this.actionsService.executeAction({
        ...dto,
        userId,
      });
      this.logsService.addLog(
        dto.action,
        'success (auto)',
        riskLevel,
        reason,
        AGENT_SOURCE,
      );
      return {
        status: 'executed',
        message: `Action ${dto.action} auto-executed (Low Risk).`,
        execution: executionResult,
      };
    }

    // 2. Check Permission for Medium/High
    const permission = this.permissionsService.checkPermission(
      userId,
      dto.action,
      dto.target,
    );

    if (permission) {
      if (riskLevel === RiskLevel.MEDIUM) {
        const executionResult = await this.actionsService.executeAction({
          ...dto,
          userId,
        });
        this.logsService.addLog(
          dto.action,
          'success',
          riskLevel,
          reason,
          AGENT_SOURCE,
        );
        return {
          status: 'executed',
          message: `Action ${dto.action} executed due to existing permission.`,
          execution: executionResult,
        };
      }

      // High risk might still need step-up even with permission
      if (riskLevel === RiskLevel.HIGH) {
        const newRequest: AgentRequest = {
          id: uuidv4(),
          userId,
          ...dto,
          status: 'pending',
          riskLevel,
          requiresStepUp: true,
          reason,
          source: AGENT_SOURCE,
          createdAt: new Date(),
        };
        this.pendingRequests.push(newRequest);
        this.saveToStorage();
        return {
          status: 'pending_step_up',
          requestId: newRequest.id,
          message: 'High risk action requires step-up authentication.',
        };
      }
    }

    // 3. Store request for approval
    const newRequest: AgentRequest = {
      id: uuidv4(),
      userId,
      ...dto,
      status: 'pending',
      riskLevel,
      reason,
      source: AGENT_SOURCE,
      createdAt: new Date(),
    };

    this.pendingRequests.push(newRequest);
    this.saveToStorage();

    return {
      status: 'pending_approval',
      requestId: newRequest.id,
      message: 'Request stored and awaiting approval.',
    };
  }

  getRequests() {
    return this.pendingRequests;
  }

  async approveRequest(dto: ApproveRequestDto) {
    const index = this.pendingRequests.findIndex((r) => r.id === dto.requestId);
    if (index === -1) {
      throw new NotFoundException('Request not found');
    }

    const request = this.pendingRequests[index];

    if (dto.decision === 'allow_always') {
      this.permissionsService.savePermission({
        userId: request.userId,
        action: request.action,
        target: request.target,
        type: 'allow_always',
      });
    }

    // Remove from pending
    this.pendingRequests.splice(index, 1);
    this.saveToStorage();

    let executionResult: any = null;

    if (dto.decision !== 'deny') {
      executionResult = await this.actionsService.executeAction(request);
      this.logsService.addLog(
        request.action,
        'success',
        request.riskLevel,
        request.reason,
        request.source,
      );
    } else {
      this.logsService.addLog(
        request.action,
        'denied',
        request.riskLevel,
        request.reason,
        request.source,
      );
    }

    return {
      status: dto.decision,
      message: `Request ${dto.requestId} has been ${dto.decision}.`,
      execution: executionResult,
    };
  }
}
