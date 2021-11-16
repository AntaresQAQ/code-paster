import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConfigService } from './config/config.service';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    res.locals.pageTitle = this.configService.config.page.title;

    res.locals.req = req;
    res.locals.res = res;

    next();
  }
}
