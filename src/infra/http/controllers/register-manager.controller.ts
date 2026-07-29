import { CpfAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/cpf-already-exists-error'
import { RegisterManagerUseCase } from '@/domain/delivery/application/use-cases/register-manager'
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

const registerManagerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  cpf: z.string().min(11),
  phoneNumber: z.string().min(1),
  password: z.string().min(6),
})

type RegisterManagerBodySchema = z.infer<typeof registerManagerSchema>

@Public()
@Controller('/managers')
export class RegisterManagerController {
  constructor(private registerManager: RegisterManagerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: RegisterManagerBodySchema) {
    const { name, cpf, email, password, phoneNumber } = body

    const result = await this.registerManager.execute({
      name,
      cpf,
      email,
      password,
      phoneNumber,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CpfAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
