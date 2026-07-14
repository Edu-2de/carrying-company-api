import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'
import { RegisterDelivererUseCase } from './register-deliverer'

let delivererRepository: InMemoryDelivererRepository
let hasher: FakeHasher
let sut: RegisterDelivererUseCase

describe('Register Deliverer Use Case', () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    hasher = new FakeHasher()
    sut = new RegisterDelivererUseCase(delivererRepository, hasher)
  })

  it('should be able to register a new deliverer', async () => {
    const deliverer = {
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      latitude: -10.8302,
      longitude: -42.7308,
      phoneNumber: '74973457035',
    }

    const response = await sut.execute(deliverer)

    expect(response.isRight()).toBe(true)
  })

  it('should not be possible to register a deliverer with an cpf that already exists', async () => {
    const deliverer = await makeDeliverer({ cpf: Cpf.create('41651534004') })
    delivererRepository.items.push(deliverer)

    const response = await sut.execute({
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      latitude: -10.8302,
      longitude: -42.7308,
      phoneNumber: '74973457035',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(CpfAlreadyExistsError)
  })
})
