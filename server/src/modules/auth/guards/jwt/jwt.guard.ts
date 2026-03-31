import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { IS_PUBLIC_KEY } from '../../../../common/decorators/public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  private client = jwksRsa({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (process.env.NODE_ENV === 'test') {
      const request = context.switchToHttp().getRequest();
      request.user = { sub: 'auth0|test-user-123' };
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.decode(token, { complete: true });

      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const key = await this.client.getSigningKey(decoded.header.kid);
      const signingKey = key.getPublicKey();

      const payload = jwt.verify(token, signingKey, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
      });

      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
