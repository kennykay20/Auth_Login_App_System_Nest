import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDetailsDto } from '../../../CORE/Applications/Dtos/Responses/User/UserDetailsDto';

type RequestWithUser = Request & { user: UserDetailsDto };

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
