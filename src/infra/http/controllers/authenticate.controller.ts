import { AuthenticateUserUseCase } from '@/domain/delivery/application/use-cases/authenticate'
import { NotAllowedError } from '@/domain/delivery/application/use-cases/errors/not-allowed-error'
import { UserDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-does-not-exists-error'
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

const authenticateUserSchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserSchema>
@Public()
@Controller('/sessions')
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: AuthenticateUserBodySchema) {
    const { cpf, password } = body

    const response = await this.authenticateUser.execute({
      cpf,
      password,
    })

    if (response.isLeft()) {
      const error = response.value
      switch (error.constructor) {
        case UserDoesNotExistsError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { token } = response.value
    return token
  }
}
