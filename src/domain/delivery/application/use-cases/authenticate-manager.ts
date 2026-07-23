import { left, right, type Either } from '@/core/either'
import type { Encrypter } from '../cryptography/encrypter'
import type { HashCompare } from '../cryptography/hash-compare'
import type { ManagerRepository } from '../repositories/manager-repository'
import { ManagerDoesNotExistsError } from './errors/manager-does-not-exists-error'
import { NotAllowedError } from './errors/not-allowed-error'

export interface AuthenticateManagerUseCaseRequest {
  cpf: string
  password: string
}

export type AuthenticateManagerUseCaseResponse = Either<
  ManagerDoesNotExistsError | NotAllowedError,
  { token: string }
>

export class AuthenticateManagerUseCase {
  constructor(
    private managerRepository: ManagerRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateManagerUseCaseRequest): Promise<AuthenticateManagerUseCaseResponse> {
    const manager = await this.managerRepository.findByCpf(cpf)
    if (!manager) return left(new ManagerDoesNotExistsError())

    const passwordValid = await this.hashCompare.compare(
      password,
      manager.password,
    )
    if (!passwordValid) return left(new NotAllowedError())

    const token = await this.encrypter.encrypt({ sub: manager.id })

    return right({ token })
  }
}
