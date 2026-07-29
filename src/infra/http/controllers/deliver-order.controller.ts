import { DeliverOrderUseCase } from '@/domain/delivery/application/use-cases/deliver-order'
import { NotAllowedError } from '@/domain/delivery/application/use-cases/errors/not-allowed-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import z from 'zod'

const deliverOrderBodySchema = z.object({
  fileName: z.string(),
})

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema)

@Controller('/orders/:id/deliver')
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Param('id') orderId: string,
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const delivererId = user.sub
    const { fileName } = body

    const response = await this.deliverOrder.execute({
      orderId,
      delivererId,
      fileName,
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
  }
}
