import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../User/user.service';
import { EmailService } from '../../../../Infrastructure/Services/email.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import type { RegisterDto } from '../../Dtos/Register/RegisterDto';
import type { LoginDto } from '../../Dtos/Login/LoginDto';
import type { Response } from 'express';
//import type { IUserRepository } from '../../Persistences/IUserRepository';
//import { User } from '../../../../Domain/Entities/User';
import { UserDetailsDto } from '../../Dtos/Responses/User/UserDetailsDto';
//import { UserMapper } from '../../Mappers/UserMapper';

@Injectable()
export class AuthService {
  // Implement your authentication-related business logic here
  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async Register(dto: RegisterDto) {
    const existingUser = await this.userService.getUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Invalid email, already in use');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // verify token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 24 hours

    // Create the user
    const user = await this.userService.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
    });

    // Send verification email
    void this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message:
        'Registration successful, please check your email to verify your account',
    };
  }

  async verifyEmail(token: string, res: Response) {
    const user = await this.userService.findUserByVerificationToken(token);
    if (!user || !user.verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException(
        'Verificationtoken has expired, please request a new one',
      );
    }
    //
    await this.userService.updateUser(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });

    const tokens = await this.generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      message: 'Email verified successfully, you are now logged in.',
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async Login(dto: LoginDto, res: Response) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'Please verify your email before logging in',
      );
    }

    const token = await this.generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    await this.saveRefreshTokenHash(user.id, token.refreshToken);
    this.setRefreshTokenCookie(res, token.refreshToken);

    return {
      message: 'Login successful',
      accessToken: token.accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async generateToken(user: UserDetailsDto) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Please provide a refresh token');
    }

    let payload: { sub: string; email: string; role: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getUserById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newTokens = await this.generateToken(user);
    await this.saveRefreshTokenHash(user.id, newTokens.refreshToken);
    this.setRefreshTokenCookie(res, newTokens.refreshToken);

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  async logout(userId: string, res: Response) {
    await this.saveRefreshTokenHash(userId, null);
    res.clearCookie('refreshToken');
    res.clearCookie('token');
    return { message: 'Logout successful' };
  }
  private async saveRefreshTokenHash(
    userId: string,
    refreshToken: string | null,
  ) {
    const refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, 12)
      : null;
    return await this.userService.updateUser(userId, { refreshTokenHash });
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
