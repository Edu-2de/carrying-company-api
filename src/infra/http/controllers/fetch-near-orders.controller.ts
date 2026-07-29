import { NotAllowedError } from '@/domain/delivery/application/use-cases/errors/not-allowed-error'
import { FetchNearOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-near-orders'
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

const fetchNearOrderQuerySchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  page: z.coerce.number().optional().default(1),
})

type FetchNearOrderQuerySchema = z.infer<typeof fetchNearOrderQuerySchema>
const queryValidationPipe = new ZodValidationPipe(fetchNearOrderQuerySchema)

@Controller('/orders/near')
export class FetchNearOrdersController {
  constructor(private fetchNearOrders: FetchNearOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) query: FetchNearOrderQuerySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { latitude, longitude, page } = query
    const delivererId = user.sub

    const response = await this.fetchNearOrders.execute({
      latitude,
      longitude,
      delivererId,
      page,
    })

    if (response.isLeft()) {
      const error = response.value
      switch (error.constructor) {
        case NotAllowedError:
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
