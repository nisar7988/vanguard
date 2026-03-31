import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { StorageService } from '../../core/storage/storage.service';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: StorageService,
          useValue: {
            save: jest.fn(),
            load: jest.fn().mockReturnValue(null), // null will trigger default permissions in constructor
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should return a permission if it exists', () => {
    const permission = service.checkPermission('user_123', 'send_email', 'team@mail.com');
    expect(permission).toBeDefined();
    expect(permission!.type).toBe('allow_always');
  });

  it('should return undefined if permission does not exist', () => {
    const permission = service.checkPermission('user_999', 'unknown_action', 'nowhere');
    expect(permission).toBeUndefined();
  });

  it('should save a new permission', () => {
    const newRule = {
      userId: 'user_456',
      action: 'delete_account',
      scope: '*',
      type: 'allow_always' as const,
    };
    service.savePermission(newRule);
    const saved = service.checkPermission('user_456', 'delete_account', 'anything');
    expect(saved).toEqual(newRule);
  });

  it('should return all permissions', () => {
    const all = service.getAllPermissions();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });
});
