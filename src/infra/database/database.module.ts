import { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository'
import { ManagerRepository } from '@/domain/delivery/application/repositories/manager-repository'
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaDelivererRepository } from './prisma/repositories/prisma-deliverer-repository'
import { PrismaManagerRepository } from './prisma/repositories/prisma-manager-repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
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
    {
      provide: DelivererRepository,
      useClass: PrismaDelivererRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [
    PrismaService,
    RecipientRepository,
    ManagerRepository,
    DelivererRepository,
    OrderRepository,
  ],
})
export class DatabaseModule {}
