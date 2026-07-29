import { AuthenticateUserUseCase } from '@/domain/delivery/application/use-cases/authenticate'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { DeliverOrderUseCase } from '@/domain/delivery/application/use-cases/deliver-order'
import { FetchNearOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-near-orders'
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order'
import { RegisterDelivererUseCase } from '@/domain/delivery/application/use-cases/register-deliverer'
import { RegisterManagerUseCase } from '@/domain/delivery/application/use-cases/register-manager'
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient'
import { ReturnOrderUseCase } from '@/domain/delivery/application/use-cases/return-order'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateUserController } from './controllers/authenticate.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { DeliverOrderController } from './controllers/deliver-order.controller'
import { FetchNearOrdersController } from './controllers/fetch-near-orders.controller'
import { PickUpOrderController } from './controllers/pickup-order.controller'
import { RegisterDelivererController } from './controllers/register-deliverer.controller'
import { RegisterManagerController } from './controllers/register-manager.controller'
import { RegisterRecipientController } from './controllers/register-recipient.controller'
import { ReturnOrderController } from './controllers/return-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterRecipientController,
    RegisterManagerController,
    RegisterDelivererController,
    CreateOrderController,
    AuthenticateUserController,
    PickUpOrderController,
    ReturnOrderController,
    FetchNearOrdersController,
    DeliverOrderController,
  ],
  providers: [
    RegisterRecipientUseCase,
    RegisterManagerUseCase,
    RegisterDelivererUseCase,
    CreateOrderUseCase,
    AuthenticateUserUseCase,
    PickUpOrderUseCase,
    ReturnOrderUseCase,
    FetchNearOrdersUseCase,
    DeliverOrderUseCase,
  ],
})
export class HttpModule {}
