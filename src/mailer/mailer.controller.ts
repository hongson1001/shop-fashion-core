import { Controller } from '@nestjs/common';
import { MailerCustomerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerCustomerService) {}
}
