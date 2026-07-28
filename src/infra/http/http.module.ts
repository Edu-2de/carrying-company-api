import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { RegisterDelivererUseCase } from '@/domain/delivery/application/use-cases/register-deliverer'
import { RegisterManagerUseCase } from '@/domain/delivery/application/use-cases/register-manager'
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { CreateOrderController } from './controllers/create-order.controller'
import { RegisterDelivererController } from './controllers/register-deliverer.controller'
import { RegisterManagerController } from './controllers/register-manager.controller'
import { RegisterRecipientController } from './controllers/register-recipient.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterRecipientController,
    RegisterManagerController,
    RegisterDelivererController,
    CreateOrderController,
  ],
  providers: [
    RegisterRecipientUseCase,
    RegisterManagerUseCase,
    RegisterDelivererUseCase,
    CreateOrderUseCase,
  ],
})
export class HttpModule {}
