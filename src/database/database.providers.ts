import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@/config/config.service';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: configService.config.database.type,
      host: configService.config.database.host,
      port: configService.config.database.port,
      username: configService.config.database.username,
      password: configService.config.database.password,
      database: configService.config.database.database,
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      logging: !!process.env.CODE_PASTER_LOG_SQL,
      charset: 'utf8mb4',
      synchronize: true,
    }),
    inject: [ConfigService],
  }),
];
