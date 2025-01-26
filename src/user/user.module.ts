import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'models/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import {
  UserInformation,
  UserInformationSchema,
} from 'models/schema/userInformation.schema';
import { Admin, AdminSchema } from 'models/schema/admin.schema';
import { TokenBlacklistService } from 'src/token-blacklist/token-blacklist.service';
import {
  TokenBlacklist,
  TokenBlacklistSchema,
} from 'models/schema/tokenblacklist';
import { MailerCustomerModule } from 'src/mailer/mailer.module';
import { MailerCustomerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserInformation.name, schema: UserInformationSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: TokenBlacklist.name, schema: TokenBlacklistSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('USER_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('USER_JWT_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    MailerCustomerModule,
  ],
  controllers: [UserController],
  providers: [UserService, TokenBlacklistService, MailerCustomerService],
  exports: [UserService],
})
export class UserModule {}
