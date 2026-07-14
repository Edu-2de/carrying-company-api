import { left, right, type Either } from '@/core/either'
import { Deliverer } from '@domain/delivery/enterprise/entities/deliverer'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { Cpf } from '@domain/delivery/enterprise/entities/value-objects/cpf'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

export interface RegisterDelivererUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  latitude: number
  longitude: number
  phoneNumber: string
}

type RegisterDelivererUseCaseResponse = Either<
  CpfAlreadyExistsError | EmailAlreadyExistsError,
  {}
>

export class RegisterDelivererUseCase {
  constructor(private delivererRepository: DelivererRepository) {}

  async execute({
    name,
    cpf,
    email,
    password,
    latitude,
    longitude,
    phoneNumber,
  }: RegisterDelivererUseCaseRequest): Promise<RegisterDelivererUseCaseResponse> {
    const cpfAlreadyExists = await this.delivererRepository.findByCpf(cpf)
    if (cpfAlreadyExists) return left(new CpfAlreadyExistsError())

    const cpfToDomain = Cpf.create(cpf)

    const emailAlreadyExists = await this.delivererRepository.findByEmail(email)
    if (emailAlreadyExists) return left(new EmailAlreadyExistsError())

    const locationToDomain = Coordinate.create(latitude, longitude)

    const deliverer = Deliverer.create({
      name,
      cpf: cpfToDomain,
      email,
      password,
      phoneNumber,
      location: locationToDomain,
    })

    await this.delivererRepository.create(deliverer)

    return right({})
  }
}
