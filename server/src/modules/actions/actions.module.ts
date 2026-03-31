import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
