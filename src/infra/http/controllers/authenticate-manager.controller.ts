import { AuthenticateManagerUseCase } from '@/domain/delivery/application/use-cases/authenticate-manager'
import { ManagerDoesNotExistsError } from '@/domain/delivery/application/use-cases/errors/manager-does-not-exists-error'
import { NotAllowedError } from '@/domain/delivery/application/use-cases/errors/not-allowed-error'
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

const authenticateManagerSchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateManagerBodySchema = z.infer<typeof authenticateManagerSchema>

@Public()
@Controller('/managers/sessions')
export class AuthenticateManagerController {
  constructor(private authenticateManager: AuthenticateManagerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: AuthenticateManagerBodySchema) {
    const { cpf, password } = body

    const response = await this.authenticateManager.execute({
      cpf,
      password,
    })

    if (response.isLeft()) {
      const error = response.value
      switch (error.constructor) {
        case ManagerDoesNotExistsError:
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
