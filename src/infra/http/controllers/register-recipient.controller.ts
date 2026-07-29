import { CpfAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/cpf-already-exists-error'
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient'
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

const registerRecipientSchema = z.object({
  name: z.string().min(1),
  cpf: z.string().min(11),
  phoneNumber: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
})

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientSchema>

@Public()
@Controller('/recipients')
export class RegisterRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: RegisterRecipientBodySchema) {
    const { name, cpf, phoneNumber, latitude, longitude } = body

    const result = await this.registerRecipient.execute({
      name,
      cpf,
      phoneNumber,
      latitude,
      longitude,
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
