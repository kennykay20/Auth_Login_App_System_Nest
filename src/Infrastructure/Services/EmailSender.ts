import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

export class EmailSender {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async sendEmail(email: string, subject: string, html: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject,
      html,
    });
  }
}
