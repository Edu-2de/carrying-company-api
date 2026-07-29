import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { ManagerDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/manager-does-not-exists-error'
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
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createOrderSchema = z.object({
  title: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  expectedDate: z.coerce.date(),
  recipientId: z.uuid(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderSchema>
const bodyValidationPipe = new ZodValidationPipe(createOrderSchema)

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
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
        case ManagerDoesNotExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
