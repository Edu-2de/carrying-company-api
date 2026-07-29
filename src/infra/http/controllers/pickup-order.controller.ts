import { DelivererDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/deliverer-does-not-exists-error'
import { OrderDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/order-does-not-exists-error'
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order'
import { OrderNotAvailableError } from '@/domain/delivery/enterprise/entities/errors/order-not-available-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'

@Controller('/orders/pickup/:id')
export class PickUpOrderController {
  constructor(private pickUpOrder: PickUpOrderUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') orderId: string,
  ) {
    const delivererId = user.sub

    const response = await this.pickUpOrder.execute({
      delivererId,
      orderId,
    })

    if (response.isLeft()) {
      const error = response.value
      switch (error.constructor) {
        case OrderDoesNotExistsError:
          throw new ConflictException(error.message)
        case DelivererDoesNotExistsError:
          throw new ConflictException(error.message)
        case OrderNotAvailableError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
