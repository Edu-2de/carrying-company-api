import { DelivererDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/deliverer-does-not-exists-error'
import { OrderDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/order-does-not-exists-error'
import { ReturnOrderUseCase } from '@/domain/delivery/application/use-cases/return-order'
import { DelivererNotAuthorizedError } from '@/domain/delivery/enterprise/entities/errors/deliverer-not-authorized-error'
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

@Controller('/orders/return/:id')
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') orderId: string,
  ) {
    const delivererId = user.sub

    const response = await this.returnOrder.execute({
      orderId,
      delivererId,
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
        case DelivererNotAuthorizedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
