import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from '../../CORE/Applications/Features/Auth/auth.service';
import { RegisterDto } from '../../CORE/Applications/Dtos/Register/RegisterDto';
import { LoginDto } from '../../CORE/Applications/Dtos/Login/LoginDto';
import { Public } from '../../Shared/Common/Decorators/public.decorator';
import { CurrentUser } from '../../Shared/Common/Decorators/current-user.decorator';
import { UserDetailsDto } from 'src/CORE/Applications/Dtos/Responses/User/UserDetailsDto';
import { ForgotPasswordDto } from 'src/CORE/Applications/Dtos/Password/forgotPasswordDto';
import { ResetPasswordDto } from 'src/CORE/Applications/Dtos/Password/resetPasswordDto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST: /api/v1/register
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    console.log('inside the register route ');
    return await this.authService.Register(dto);
  }

  // GET: /api/v1/verify-email
  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address and auto-login ' })
  async verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.verifyEmail(token, res);
  }

  // POST: /api/v1/login
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as a user, receive access + refresh token ' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Inside the login controller');
    return this.authService.Login(dto, res);
  }

  // POST: /api/v1/refresh-token
  @Public()
  @ApiOperation({
    summary: 'refresh access token using the refresh token cookie ',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @Post('refresh-token')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies as Record<string, string>;
    console.log('cookies ', cookies);
    console.log(
      `cookies.refresh - ${cookies?.refreshToken}, token - ${cookies?.token}`,
    );
    const refreshToken = cookies?.refreshToken;
    return this.authService.refreshToken(refreshToken, res);
  }

  // POST: /api/v1/logout
  @Post('logout')
  @ApiOperation({ summary: 'Logout a user, and invalidate refresh token ' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async logout(
    @CurrentUser() user: UserDetailsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(user.id, res);
  }

  // Get: api/v1/me
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  me(@CurrentUser() user: UserDetailsDto) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  //POST: /api/v1/forgot-password
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.ForgotPassword(dto.email);
  }

  //POST: /api/v1/reset-password
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset your password using token from email' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.ResetPassword(dto.token, dto.password);
  }
}
