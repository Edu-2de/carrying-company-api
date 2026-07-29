import { DelivererDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/deliverer-does-not-exists-error'
import { FetchDelivererOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-deliverer-orders'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchDelivererOrdersSchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchDelivererOrdersQuerySchema = z.infer<
  typeof fetchDelivererOrdersSchema
>
const queryValidationPipe = new ZodValidationPipe(fetchDelivererOrdersSchema)

@Controller('/orders/deliverer')
export class FetchDelivererOrdersController {
  constructor(private fetchDelivererOrders: FetchDelivererOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Query(queryValidationPipe) query: FetchDelivererOrdersQuerySchema,
  ) {
    const { page } = query
    const delivererId = user.sub

    const response = await this.fetchDelivererOrders.execute({
      delivererId,
      page,
    })

    if (response.isLeft()) {
      const error = response.value
      switch (error.constructor) {
        case DelivererDoesNotExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { orders } = response.value
    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}
