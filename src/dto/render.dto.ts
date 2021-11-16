import { LanguageConfig } from '@/common/languages';

export class IndexRenderDto {
  readonly languages: LanguageConfig[];
}

export class PasteRenderDto {
  readonly title: string;
  readonly lang: string;
  readonly code: string;
  readonly time: string;
  readonly expiration: string;
}
