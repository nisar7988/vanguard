import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { TokenVaultService } from '../auth/token-vault.service';

describe('ActionsService', () => {
  let service: ActionsService;
  let tokenVaultService: TokenVaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: TokenVaultService,
          useValue: {
            getExternalToken: jest.fn().mockResolvedValue('mock_token_123'),
          },
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
    tokenVaultService = module.get<TokenVaultService>(TokenVaultService);
  });

  it('should execute an action and return success with a token', async () => {
    const request = { userId: 'u1', action: 'test', target: 'recipient' };
    const result = await service.executeAction(request);

    expect(result.status).toBe('success');
    expect(result.token).toBe('mock_token_123');
    expect(tokenVaultService.getExternalToken).toHaveBeenCalledWith('u1', 'gmail');
  });
});
