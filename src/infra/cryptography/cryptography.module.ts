import { HashCompare } from '@/domain/delivery/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [HashCompare, HashGenerator],
})
export class CryptographyModule {}
