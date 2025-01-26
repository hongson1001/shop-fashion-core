import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';
import { TokenBlacklistController } from './token-blacklist.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TokenBlacklist,
  TokenBlacklistSchema,
} from 'models/schema/tokenblacklist';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
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
  ],
  controllers: [TokenBlacklistController],
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}
