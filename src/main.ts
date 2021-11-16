import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import getGitRepoInfo from 'git-repo-info';
import moment from 'moment';
import { join } from 'path';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ErrorFilter, ErrorMessageFilter } from './error.filter';

export const appGitRepoInfo = getGitRepoInfo();

async function bootstrap() {
  // Get package info
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageInfo = require('../package.json');
  const appVersion = `v${packageInfo.version}`;
  const gitRepoVersion = appGitRepoInfo.abbreviatedSha
    ? ` (Git revision ${appGitRepoInfo.abbreviatedSha} on ${moment(
        appGitRepoInfo.committerDate,
      ).format('YYYY-MM-DD H:mm:ss')})`
    : '';

  Logger.log(
    `Starting ${packageInfo.name} version ${appVersion}${gitRepoVersion}`,
    'Bootstrap',
  );

  // Create nestjs app
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(process.env.NODE_ENV === 'production' ? { logger: ['warn', 'error'] } : {}),
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(app.get(ErrorFilter), app.get(ErrorMessageFilter));
  app.use(json({ limit: '1mb' }));
  app.use(cookieParser());
  app.set('trust proxy', configService.config.server.trustProxy);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });

  await app.listen(
    configService.config.server.port,
    configService.config.server.hostname,
  );
  Logger.log(
    `${packageInfo.name} is listening on ` +
      `${configService.config.server.hostname}:${configService.config.server.port}`,
    'Bootstrap',
  );
}

bootstrap().catch(err => {
  console.error(err);
  console.error('Error bootstrapping the application, exiting...');
  process.exit(1);
});
