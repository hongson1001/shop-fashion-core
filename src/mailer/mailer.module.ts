import { Module } from '@nestjs/common';
import { MailerCustomerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_HOST'),
          port: parseInt(config.get('EMAIL_PORT'), 10),
          secure: config.get('EMAIL_SECURE') === 'true',
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASS'),
          },
        },
        defaults: {
          from: config.get('EMAIL_FROM'),
        },
      }),
    }),
  ],
  controllers: [MailerController],
  providers: [MailerCustomerService],
  exports: [MailerCustomerService],
})
export class MailerCustomerModule {}
