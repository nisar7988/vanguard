import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AuthModule } from '../auth/auth.module';
import { LogsModule } from '../logs/logs.module';
import { ActionsModule } from '../actions/actions.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [AuthModule, LogsModule, ActionsModule, PermissionsModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
