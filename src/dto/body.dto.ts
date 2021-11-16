import { IsIn, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class IndexBodyDto {
  @IsString()
  @Length(1, 24)
  readonly title: string;

  @IsNumberString()
  @IsIn(['0', '1', '7', '30', '90', '360'])
  readonly limit: '0' | '1' | '7' | '30' | '90' | '360';

  @IsString()
  readonly lang: string;

  @IsString()
  readonly code: string;

  @IsString()
  @IsOptional()
  readonly 'g-recaptcha-response'?: string;
}
