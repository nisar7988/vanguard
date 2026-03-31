import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all saved permissions' })
  getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }
}
