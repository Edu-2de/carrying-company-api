import { AuthenticateUserUseCase } from '@/domain/delivery/application/use-cases/authenticate'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order'
import { RegisterDelivererUseCase } from '@/domain/delivery/application/use-cases/register-deliverer'
import { RegisterManagerUseCase } from '@/domain/delivery/application/use-cases/register-manager'
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateUserController } from './controllers/authenticate.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { PickUpOrderController } from './controllers/pickup-order.controller'
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
    AuthenticateUserController,
    PickUpOrderController,
  ],
  providers: [
    RegisterRecipientUseCase,
    RegisterManagerUseCase,
    RegisterDelivererUseCase,
    CreateOrderUseCase,
    AuthenticateUserUseCase,
    PickUpOrderUseCase,
  ],
})
export class HttpModule {}
