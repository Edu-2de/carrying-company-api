import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { RecipientDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/recipient-does-not-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import z from 'zod'

const createOrderSchema = z.object({
  title: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  expectedDate: z.date(),
  recipientId: z.string(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderSchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body() body: CreateOrderBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { title, latitude, longitude, expectedDate, recipientId } = body

    const managerId = user.sub

    const response = await this.createOrder.execute({
      title,
      latitude,
      longitude,
      expectedDate,
      recipientId,
      managerId,
    })

    if (response.isLeft()) {
      const error = response.value
      switch (error.constructor) {
        case RecipientDoesNotExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
