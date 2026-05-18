import { Module } from '@nestjs/common';
import { EmailService } from '../../Infrastructure/Services/email.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
