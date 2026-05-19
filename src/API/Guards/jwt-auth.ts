import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../../Shared/Common/Decorators/public.decorator';
import { UserService } from '../../CORE/Applications/Features/User/user.service';
import { UserDetailsDto } from 'src/CORE/Applications/Dtos/Responses/User/UserDetailsDto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: UserDetailsDto }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    let payload: { sub: string; email: string; role: string };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('');
    }
    request.user = user;
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] =
      (req.headers as unknown as Record<string, string>).authorization?.split(
        ' ',
      ) ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
