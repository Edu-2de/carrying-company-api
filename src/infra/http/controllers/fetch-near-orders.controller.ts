import { NotAllowedError } from '@/domain/delivery/application/use-cases/errors/not-allowed-error'
import { FetchNearOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-near-orders'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
} from '@nestjs/common'
import z from 'zod'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchNearOrderSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

type FetchNearOrderBodySchema = z.infer<typeof fetchNearOrderSchema>

@Controller('/orders/near')
export class FetchNearOrdersController {
  constructor(private fetchNearOrders: FetchNearOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body() body: FetchNearOrderBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { latitude, longitude } = body
    const delivererId = user.sub

    const response = await this.fetchNearOrders.execute({
      latitude,
      longitude,
      delivererId,
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
