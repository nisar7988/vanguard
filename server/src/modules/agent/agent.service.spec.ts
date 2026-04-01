import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from './agent.service';
import { PermissionsService } from '../permissions/permissions.service';
import { ActionsService } from '../actions/actions.service';
import { LogsService } from '../logs/logs.service';
import { NotFoundException } from '@nestjs/common';
import { StorageService } from '../../core/storage/storage.service';

describe('AgentService', () => {
  let service: AgentService;
  let permissionsService: PermissionsService;
  let actionsService: ActionsService;
  let logsService: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: PermissionsService,
          useValue: {
            checkPermission: jest.fn(),
            savePermission: jest.fn(),
          },
        },
        {
          provide: ActionsService,
          useValue: {
            executeAction: jest.fn().mockResolvedValue({ status: 'success' }),
          },
        },
        {
          provide: LogsService,
          useValue: {
            addLog: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {
            save: jest.fn(),
            load: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
    permissionsService = module.get<PermissionsService>(PermissionsService);
    actionsService = module.get<ActionsService>(ActionsService);
    logsService = module.get<LogsService>(LogsService);
  });

  describe('handleRequest', () => {
    it('should auto-execute if LOW risk', async () => {
      const dto = { action: 'read_status', target: 't', content: 'm' };
      const result = await service.handleRequest(dto, 'u1');

      expect(result.status).toBe('executed');
      expect(result.message).toContain('auto-executed');
      expect(actionsService.executeAction).toHaveBeenCalled();
      expect(logsService.addLog).toHaveBeenCalledWith('read_status', 'success (auto)', 'low');
    });

    it('should execute if MEDIUM risk and permission exists', async () => {
      (permissionsService.checkPermission as jest.Mock).mockReturnValue({ type: 'allow_always' });
      
      const dto = { action: 'send_email', target: 't', content: 'm' };
      const result = await service.handleRequest(dto, 'u1');

      expect(result.status).toBe('executed');
      expect(actionsService.executeAction).toHaveBeenCalled();
      expect(logsService.addLog).toHaveBeenCalledWith('send_email', 'success', 'medium');
    });

    it('should store as pending if MEDIUM risk and NO permission exists', async () => {
      (permissionsService.checkPermission as jest.Mock).mockReturnValue(undefined);
      
      const dto = { action: 'send_email', target: 't', content: 'm' };
      const result = await service.handleRequest(dto, 'u1');

      expect(result.status).toBe('pending_approval');
      expect(service.getRequests().length).toBe(1);
    });

    it('should require step-up if HIGH risk even with permission', async () => {
      (permissionsService.checkPermission as jest.Mock).mockReturnValue({ type: 'allow_always' });
      
      const dto = { action: 'delete_account', target: 't', content: 'm' };
      const result = await service.handleRequest(dto, 'u1');

      expect(result.status).toBe('pending_step_up');
      expect(result.message).toContain('requires step-up');
    });
  });

  describe('approveRequest', () => {
    it('should save permission and execute if always_allow', async () => {
      // Setup: add a pending request
      const dto = { action: 'send', target: 't', content: 'm' };
      const req = await service.handleRequest(dto, 'u1');
      const requestId = (req as any).requestId;

      const result = await service.approveRequest({ requestId, decision: 'allow_always' });

      expect(result.status).toBe('allow_always');
      expect(permissionsService.savePermission).toHaveBeenCalled();
      expect(actionsService.executeAction).toHaveBeenCalled();
    });

    it('should throw error if request not found', async () => {
      await expect(service.approveRequest({ requestId: '999', decision: 'deny' }))
        .rejects.toThrow(NotFoundException);
    });
  });
});
