import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsIP,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsPortNumber } from '@/common/validators';

class ServerConfig {
  @IsIP()
  readonly hostname: string;

  @IsPortNumber()
  readonly port: number;

  @IsArray()
  @IsString({ each: true })
  readonly trustProxy: string;
}

class DatabaseConfig {
  @IsIn(['mysql', 'mariadb'])
  readonly type: 'mysql' | 'mariadb';

  @IsString()
  readonly host: string;

  @IsPortNumber()
  readonly port: number;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly database: string;
}

class PageConfig {
  @IsString()
  readonly title: string;
}

class RecaptchaConfig {
  @IsBoolean()
  readonly enable: boolean;

  @IsString()
  @IsOptional()
  readonly siteKey?: string;

  @IsString()
  @IsOptional()
  readonly secret?: string;
}

export class AppConfig {
  @ValidateNested()
  @Type(() => ServerConfig)
  readonly server: ServerConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  readonly database: DatabaseConfig;

  @ValidateNested()
  @Type(() => PageConfig)
  readonly page: PageConfig;

  @ValidateNested()
  @Type(() => RecaptchaConfig)
  recaptcha: RecaptchaConfig;
}
