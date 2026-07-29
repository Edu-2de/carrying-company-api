import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../cryptography/encrypter'
import { HashCompare } from '../cryptography/hash-compare'
import { UserRepository } from '../repositories/user-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { UserDoesNotExistsError } from './errors/user-does-not-exists-error'

export interface AuthenticateUserUseCaseRequest {
  cpf: string
  password: string
}

export type AuthenticateUserUseCaseResponse = Either<
  UserDoesNotExistsError | NotAllowedError,
  { token: string }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByCpf(cpf)
    if (!user) return left(new UserDoesNotExistsError())

    const passwordValid = await this.hashCompare.compare(
      password,
      user.password,
    )
    if (!passwordValid) return left(new NotAllowedError())

    const token = await this.encrypter.encrypt({ sub: user.id })

    return right({ token })
  }
}
