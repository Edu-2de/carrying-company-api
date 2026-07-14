import { left, right, type Either } from '@/core/either'
import { Recipient } from '@domain/delivery/enterprise/entities/recipient'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { Cpf } from '@domain/delivery/enterprise/entities/value-objects/cpf'
import type { RecipientRepository } from '../repositories/recipient-repository'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'

export interface RegisterRecipientUseCaseRequest {
  name: string
  cpf: string
  phoneNumber: string
  latitude: number
  longitude: number
}

export type RegisterRecipientUseCaseResponse = Either<CpfAlreadyExistsError, {}>

export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    cpf,
    phoneNumber,
    latitude,
    longitude,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const cpfAlreadyExists = await this.recipientRepository.findByCpf(cpf)
    if (cpfAlreadyExists) return left(new CpfAlreadyExistsError())

    const formattedCpf = Cpf.create(cpf)

    const formattedLocation = Coordinate.create(latitude, longitude)

    const recipient = Recipient.create({
      name,
      cpf: formattedCpf,
      phoneNumber,
      location: formattedLocation,
    })

    await this.recipientRepository.create(recipient)

    return right({})
  }
}
