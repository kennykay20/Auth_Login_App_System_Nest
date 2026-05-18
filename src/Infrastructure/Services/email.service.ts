import { Injectable } from '@nestjs/common';
import { EmailSender } from './EmailSender';
import { ConfigService } from '@nestjs/config';
import { VerifyEmail } from './EmailTemplates/VerifyEmail';
import { ResetPassword } from './EmailTemplates/ResetPassword';

@Injectable()
export class EmailService {
  private emailSender: EmailSender;
  constructor(private configService: ConfigService) {
    this.emailSender = new EmailSender(this.configService);
  }

  async sendVerificationEmail(email: string, token: string) {
    const appURL = this.configService.get<string>('APP_URL');
    const fullVerifyUrl = `${appURL}/api/v1/auth/verify-email?token=${token}`;
    const html = VerifyEmail.template(fullVerifyUrl);
    await this.emailSender.sendEmail(email, 'Verify Email', html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const appURL = this.configService.get<string>('APP_URL');
    const fullResetUrl = `${appURL}/api/v1/auth/reset-password?token=${token}`;
    const html = ResetPassword.template(fullResetUrl);
    await this.emailSender.sendEmail(email, 'Password Reset', html);
  }
}
