import { left, right, type Either } from '@/core/either'
import { Deliverer } from '@domain/delivery/enterprise/entities/deliverer'
import { Cpf } from '@domain/delivery/enterprise/entities/value-objects/cpf'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

export interface RegisterDelivererUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  phoneNumber: string
}

type RegisterDelivererUseCaseResponse = Either<
  CpfAlreadyExistsError | EmailAlreadyExistsError,
  {}
>

export class RegisterDelivererUseCase {
  constructor(
    private delivererRepository: DelivererRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
    phoneNumber,
  }: RegisterDelivererUseCaseRequest): Promise<RegisterDelivererUseCaseResponse> {
    const cpfAlreadyExists = await this.delivererRepository.findByCpf(cpf)
    if (cpfAlreadyExists) return left(new CpfAlreadyExistsError())

    const formattedCpf = Cpf.create(cpf)

    const emailAlreadyExists = await this.delivererRepository.findByEmail(email)
    if (emailAlreadyExists) return left(new EmailAlreadyExistsError())

    const passwordHash = await this.hashGenerator.hash(password)

    const deliverer = Deliverer.create({
      name,
      cpf: formattedCpf,
      email,
      password: passwordHash,
      phoneNumber,
    })

    await this.delivererRepository.create(deliverer)

    return right({})
  }
}
