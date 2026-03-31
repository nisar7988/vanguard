import { Injectable } from '@nestjs/common';
import { TokenVaultService } from '../auth/token-vault.service';

@Injectable()
export class ActionsService {
  constructor(private readonly tokenVaultService: TokenVaultService) {}

  async executeAction(request: any) {
    // Step 1: get token (mock for now)
    const token = await this.tokenVaultService.getExternalToken(
      request.userId || 'user_123',
      'gmail',
    );

    // Step 2: simulate API call
    console.log(`[Action] Executing ${request.action} for ${request.to}`);
    
    return {
      status: 'success',
      message: `${request.action} completed successfully`,
      details: {
        to: request.to,
        timestamp: new Date().toISOString(),
      },
      token, // Include token in response for demonstration
    };
  }
}
