import { left, right, type Either } from '@/core/either'
import type { Encrypter } from '../cryptography/encrypter'
import type { HashCompare } from '../cryptography/hash-compare'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import { DelivererDoesNotExistsError } from './errors/deliverer-does-not-exists-error'
import { NotAllowedError } from './errors/not-allowed-error'

export interface AuthenticateDelivererUseCaseRequest {
  cpf: string
  password: string
}

export type AuthenticateDelivererUseCaseResponse = Either<
  DelivererDoesNotExistsError | NotAllowedError,
  { token: string }
>

export class AuthenticateDelivererUseCase {
  constructor(
    private delivererRepository: DelivererRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDelivererUseCaseRequest): Promise<AuthenticateDelivererUseCaseResponse> {
    const deliverer = await this.delivererRepository.findByCpf(cpf)
    if (!deliverer) return left(new DelivererDoesNotExistsError())

    const passwordValid = await this.hashCompare.compare(
      password,
      deliverer.password,
    )
    if (!passwordValid) return left(new NotAllowedError())

    const token = await this.encrypter.encrypt({ sub: deliverer.id })

    return right({ token })
  }
}
