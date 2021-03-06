import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';

import { AppEntity } from './app.entity';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AppEntity)
    private readonly appRepository: Repository<AppEntity>,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {}

  async verifyRecaptcha(recaptchaResponse: string, ip: string): Promise<boolean> {
    const body = stringify({
      secret: this.configService.config.recaptcha.secret,
      response: recaptchaResponse,
      remoteip: ip,
    });
    const res = await axios.post(
      'https://www.recaptcha.net/recaptcha/api/siteverify',
      body,
    );
    return res.data.success;
  }

  async findPasterByUUID(uid: string): Promise<AppEntity> {
    return await this.appRepository.findOne({ uid });
  }

  async createPaster(
    title: string,
    limit: number,
    lang: string,
    code: string,
    ip: string = null,
  ): Promise<AppEntity> {
    const paster = this.appRepository.create();
    paster.uid = nanoid(15);
    paster.title = title;
    paster.lang = lang;
    paster.time = new Date();
    paster.expiration = limit ? new Date(Date.now() + limit * 24 * 60 * 60 * 1000) : null;
    paster.code = code;
    paster.ip = ip;
    await this.appRepository.save(paster);
    return paster;
  }
}
