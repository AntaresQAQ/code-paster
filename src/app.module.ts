import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppEntity } from './app.entity';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ErrorFilter, ErrorMessageFilter } from './error.filter';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => DatabaseModule),
    TypeOrmModule.forFeature([AppEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, ErrorFilter, ErrorMessageFilter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
