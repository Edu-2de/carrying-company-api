import { AuthenticateDelivererUseCase } from '@/domain/delivery/application/use-cases/authenticate-deliverer'
import { DelivererDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/deliverer-does-not-exists-error'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import z from 'zod'

const authenticateDelivererSchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateDelivererBodySchema = z.infer<
  typeof authenticateDelivererSchema
>

@Public()
@Controller('/deliverers/sessions')
export class AuthenticateDelivererController {
  constructor(private authenticateDeliverer: AuthenticateDelivererUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: AuthenticateDelivererBodySchema) {
    const { cpf, password } = body

    const response = await this.authenticateDeliverer.execute({
      cpf,
      password,
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

    const { token } = response.value
    return token
  }
}
