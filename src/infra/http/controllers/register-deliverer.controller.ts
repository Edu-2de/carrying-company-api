import { CpfAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/cpf-already-exists-error'
import { RegisterDelivererUseCase } from '@/domain/delivery/application/use-cases/register-deliverer'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import z from 'zod'

const registerDelivererSchema = z.object({
  name: z.string().min(1),
  cpf: z.string().min(11),
  email: z.email(),
  password: z.string().min(6),
  phoneNumber: z.string(),
})

type RegisterDelivererBodySchema = z.infer<typeof registerDelivererSchema>

@Controller('/deliverers')
export class RegisterDelivererController {
  constructor(private registerDeliverer: RegisterDelivererUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: RegisterDelivererBodySchema) {
    const { name, cpf, email, password, phoneNumber } = body

    const result = await this.registerDeliverer.execute({
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
