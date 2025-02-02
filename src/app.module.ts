import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { UserInformationModule } from './user-information/user-information.module';
import { ShopModule } from './shop/shop.module';
import { TokenBlacklistModule } from './token-blacklist/token-blacklist.module';
import { TokenBlacklistMiddleware } from './middleware/token-blacklist.middleware';
import { MailerCustomerModule } from './mailer/mailer.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.USER_SECRET_KEY || process.env.ADMIN_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.USER_SECRET_KEY || process.env.ADMIN_SECRET_KEY,
      },
    }),
    AdminModule,
    UserModule,
    UserInformationModule,
    ShopModule,
    TokenBlacklistModule,
    MailerCustomerModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenBlacklistMiddleware).forRoutes('*');
  }
}
