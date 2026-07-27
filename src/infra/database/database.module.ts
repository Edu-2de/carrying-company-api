import { ManagerRepository } from '@/domain/delivery/application/repositories/manager-repository'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaManagerRepository } from './prisma/repositories/prisma-manager-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: ManagerRepository,
      useClass: PrismaManagerRepository,
    },
  ],
  exports: [PrismaService, RecipientRepository, ManagerRepository],
})
export class DatabaseModule {}
