import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import fs from 'fs-extra';
import yaml from 'js-yaml';

import { AppConfig } from './config.schema';

export class ConfigService {
  readonly config: AppConfig;

  constructor() {
    const filePath = process.env.CODE_PASTER_CONFIG_FILE;
    if (!filePath) {
      throw new Error(
        'Please specify configuration file with environment variable CODE_PASTER_CONFIG_FILE',
      );
    }

    const config = yaml.load(fs.readFileSync(filePath).toString());
    this.config = ConfigService.validateInput(config);
  }

  private static validateInput(inputConfig: unknown): AppConfig {
    const appConfig = plainToClass(AppConfig, inputConfig);
    const errors = validateSync(appConfig, {
      validationError: {
        target: false,
      },
    });

    if (errors.length > 0) {
      throw new Error(`Config validation error: ${JSON.stringify(errors, null, 2)}`);
    }

    return appConfig;
  }
}
