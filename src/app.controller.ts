import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Render,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';

import { AppService } from './app.service';
import { ErrorMessage } from './common/exception';
import { Languages } from './common/languages';
import { ConfigService } from './config/config.service';
import { IndexBodyDto } from './dto/body.dto';
import { IndexRenderDto, PasteRenderDto } from './dto/render.dto';

@Controller('/')
export class AppController {
  constructor(
    private readonly configSevice: ConfigService,
    private readonly appService: AppService,
  ) {}
  @Get()
  @Render('index')
  async paste(): Promise<IndexRenderDto> {
    return {
      languages: Languages,
      recaptchaSitekey: this.configSevice.config.recaptcha.enable
        ? this.configSevice.config.recaptcha.siteKey
        : null,
    };
  }

  @Post()
  @Redirect()
  async postPaster(@Req() req: Request, @Body() body: IndexBodyDto) {
    if (this.configSevice.config.recaptcha.enable) {
      if (!(await this.appService.verifyRecaptcha(body['g-recaptcha-response']))) {
        throw new ErrorMessage(HttpStatus.FORBIDDEN, '人机验证未通过');
      }
    }
    const paster = await this.appService.createPaster(
      body.title,
      parseInt(body.limit),
      body.lang,
      body.code,
      req.ip,
    );
    return {
      url: `/paste/${paster.uuid}`,
    };
  }

  @Get('paste/:uuid')
  @Render('paste')
  async getPasterText(@Param() { uuid }): Promise<PasteRenderDto> {
    if (!uuid) {
      throw new ErrorMessage(HttpStatus.NOT_FOUND, '没有这个文档');
    }
    const paster = await this.appService.findPasterByUUID(uuid);
    if (!paster) {
      throw new ErrorMessage(HttpStatus.NOT_FOUND, '没有这个文档');
    }
    if (paster.expiration && paster.expiration.getTime() < Date.now()) {
      throw new ErrorMessage(HttpStatus.FORBIDDEN, '已过期的文档');
    }
    return {
      title: paster.title,
      lang: paster.lang,
      code: paster.code,
      time: moment(paster.time).format('YYYY-MM-DD HH:mm:ss'),
      expiration:
        paster.expiration && moment(paster.expiration).format('YYYY-MM-DD HH:mm:ss'),
    };
  }
}
