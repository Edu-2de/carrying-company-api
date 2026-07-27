import type { HashCompare } from '@/domain/delivery/application/cryptography/hash-compare'
import type { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashCompare {
  async hash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 8)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash)
  }
}
