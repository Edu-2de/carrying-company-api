import { left, right, type Either } from '@/core/either'
import { Manager } from '../../enterprise/entities/manager'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { ManagerRepository } from '../repositories/manager-repository'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'

export interface RegisterManagerUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  phoneNumber: string
}

export type RegisterManagerUseCaseResponse = Either<{}, {}>

export class RegisterManagerUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private hasher: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
    phoneNumber,
  }: RegisterManagerUseCaseRequest): Promise<RegisterManagerUseCaseResponse> {
    const cpfAlreadyExists = await this.managerRepository.findByCpf(cpf)
    if (cpfAlreadyExists) return left(new CpfAlreadyExistsError())

    const formattedCpf = Cpf.create(cpf)

    const passwordHash = await this.hasher.hash(password)

    const manager = Manager.create({
      name,
      cpf: formattedCpf,
      email,
      password: passwordHash,
      phoneNumber,
    })

    await this.managerRepository.create(manager)

    return right({})
  }
}
