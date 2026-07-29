import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { User } from '../../enterprise/entities/user' // Importe a nova entidade
import { AuthenticateUserUseCase } from './authenticate'

let userRepository: InMemoryUserRepository
let encrypter: FakeEncrypter
let hasher: FakeHasher
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    encrypter = new FakeEncrypter()
    hasher = new FakeHasher()
    sut = new AuthenticateUserUseCase(userRepository, hasher, encrypter)
  })

  it('should be able to authenticate a user', async () => {
    const user = User.create({
      cpf: '27712757593',
      password: 'password123-hashed',
      role: 'Deliverer',
    })

    userRepository.items.push(user)

    const response = await sut.execute({
      cpf: '27712757593',
      password: 'password123',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(expect.objectContaining({ token: 'token' }))
  })
})
