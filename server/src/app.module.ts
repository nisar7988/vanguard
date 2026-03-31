import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentModule } from './modules/agent/agent.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LogsModule } from './modules/logs/logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './modules/auth/guards/jwt/jwt.guard';
import { ActionsModule } from './modules/actions/actions.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    AgentModule,
    PermissionsModule,
    LogsModule,
    AuthModule,
    ActionsModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
