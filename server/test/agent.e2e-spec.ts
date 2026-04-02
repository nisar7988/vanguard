import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { APP_GUARD } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Agent Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(APP_GUARD)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { sub: 'auth0|test-user-123' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();

    // Apply same global configurations as main.ts
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle the full Request -> Approve -> Auto-execute flow', async () => {
    const agentRequest = {
      action: 'send_email',
      to: 'boss@company.com',
      message: 'I am finished with the tests',
    };

    // 1. Initial Request (Should be pending)
    const res1 = await request(app.getHttpServer())
      .post('/api/v1/agent/request')
      .send(agentRequest)
      .expect(201);

    expect(res1.body.data.status).toBe('pending_approval');
    const requestId = res1.body.data.requestId;

    // 2. Check Pending Requests
    const res2 = await request(app.getHttpServer())
      .get('/api/v1/agent/requests')
      .expect(200);

    expect(res2.body.data.some((r: any) => r.id === requestId)).toBe(true);

    // 3. Approve with 'allow_always'
    await request(app.getHttpServer())
      .post('/api/v1/agent/approve')
      .send({ requestId, decision: 'allow_always' })
      .expect(201);

    // 4. Second Request (Should be executed IMMEDIATELY)
    const res4 = await request(app.getHttpServer())
      .post('/api/v1/agent/request')
      .send(agentRequest)
      .expect(201);

    expect(res4.body.data.status).toBe('executed');
    expect(res4.body.data.message).toContain('executed immediately');

    // 5. Verify Logs
    const res5 = await request(app.getHttpServer())
      .get('/api/v1/logs')
      .expect(200);

    const logs = res5.body.data;
    expect(logs.length).toBeGreaterThanOrEqual(2);
    expect(
      logs.some(
        (l: any) => l.action === 'send_email' && l.status === 'success',
      ),
    ).toBe(true);
  });
});
