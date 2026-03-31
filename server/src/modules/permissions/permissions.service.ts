import { Injectable } from '@nestjs/common';
import { StorageService } from '../../core/storage/storage.service';

export interface Permission {
  userId: string;
  action: string;
  scope: string;
  type: 'allow_always' | 'allow_once' | 'deny';
}

@Injectable()
export class PermissionsService {
  private permissions: Permission[] = [];
  private readonly STORAGE_KEY = 'permissions';

  constructor(private readonly storageService: StorageService) {
    const loaded = this.storageService.load<Permission[]>(this.STORAGE_KEY);
    this.permissions = loaded || [
      {
        userId: 'user_123',
        action: 'send_email',
        scope: 'team@mail.com',
        type: 'allow_always',
      },
    ];
  }

  checkPermission(userId: string, action: string, scope: string): Permission | undefined {
    return this.permissions.find(
      (p) => 
        p.userId === userId && 
        p.action === action && 
        (p.scope === '*' || p.scope === scope) &&
        p.type === 'allow_always'
    );
  }

  savePermission(permission: Permission) {
    this.permissions.push(permission);
    this.storageService.save(this.STORAGE_KEY, this.permissions);
    console.log(`[Permission] Saved ${permission.type} for ${permission.userId} - ${permission.action}`);
  }

  getAllPermissions(): Permission[] {
    return this.permissions;
  }
}
