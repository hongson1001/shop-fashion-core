import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'models/schema/user.schema';
import {
  UserInformation,
  UserInformationSchema,
} from 'models/schema/userInformation.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserInformation.name, schema: UserInformationSchema },
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
  ],
  controllers: [UserInformationController],
  providers: [UserInformationService],
})
export class UserInformationModule {}
