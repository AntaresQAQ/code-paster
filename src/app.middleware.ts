import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConfigService } from './config/config.service';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    res.locals.pageConfig = this.configService.config.page;
    res.locals.recaptchaEnable = this.configService.config.recaptcha.enable;
    if (this.configService.config.recaptcha.enable) {
      res.locals.recaptchaSitekey = this.configService.config.recaptcha.siteKey;
    }

    res.locals.req = req;
    res.locals.res = res;

    next();
  }
}
