import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';

@ApiTags('logs')
@ApiBearerAuth()
@Controller({
  path: 'logs',
  version: '1',
})
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activity logs' })
  getLogs() {
    return this.logsService.getLogs();
  }
}
