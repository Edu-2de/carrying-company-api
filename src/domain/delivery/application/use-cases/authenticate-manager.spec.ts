import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeManager } from '@/test/factories/make-manager'
import { InMemoryManagerRepository } from '@/test/repositories/in-memory-manager-repository'
import { describe, it } from 'vitest'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { AuthenticateManagerUseCase } from './authenticate-manager'

let managerRepository: InMemoryManagerRepository
let encrypter: FakeEncrypter
let hasher: FakeHasher
let sut: AuthenticateManagerUseCase

describe('Authenticate Manager Use Case', () => {
  beforeEach(async () => {
    managerRepository = new InMemoryManagerRepository()
    encrypter = new FakeEncrypter()
    hasher = new FakeHasher()
    sut = new AuthenticateManagerUseCase(managerRepository, hasher, encrypter)
  })

  it('should be able to authenticate', async () => {
    const manager = makeManager({
      cpf: Cpf.create('27712757593'),
      password: 'password123-hashed',
    })
    managerRepository.create(manager)

    const response = await sut.execute({
      cpf: '27712757593',
      password: 'password123',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(expect.objectContaining({ token: 'token' }))
  })
})
