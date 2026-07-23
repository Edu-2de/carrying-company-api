import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { describe, it } from 'vitest'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { AuthenticateDelivererUseCase } from './authenticate-deliverer'

let delivererRepository: InMemoryDelivererRepository
let encrypter: FakeEncrypter
let hasher: FakeHasher
let sut: AuthenticateDelivererUseCase

describe('Authenticate Deliverer Use Case', () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    encrypter = new FakeEncrypter()
    hasher = new FakeHasher()
    sut = new AuthenticateDelivererUseCase(
      delivererRepository,
      hasher,
      encrypter,
    )
  })

  it('should be able to authenticate', async () => {
    const deliverer = makeDeliverer({
      cpf: Cpf.create('27712757593'),
      password: 'password123-hashed',
    })
    delivererRepository.create(deliverer)

    const response = await sut.execute({
      cpf: '27712757593',
      password: 'password123',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(expect.objectContaining({ token: 'token' }))
  })
})
