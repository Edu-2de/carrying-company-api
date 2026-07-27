import type { ConfigService } from '@nestjs/config'
import type { Env } from './env'

export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
