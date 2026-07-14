import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { Cpf } from '@domain/delivery/enterprise/entities/value-objects/cpf'
import { beforeEach, describe, expect, it } from 'vitest'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
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
      phoneNumber: '74973457035',
    }

    const response = await sut.execute(deliverer)

    expect(response.isRight()).toBe(true)
  })

  it('should be possible to generate the password hash at the time of registration', async () => {
    const deliverer = {
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      phoneNumber: '74973457035',
    }

    const response = await sut.execute(deliverer)
    const delivererCreated = delivererRepository.items[0]

    const isPasswordValid = await hasher.compare(
      deliverer.password,
      delivererCreated!.password,
    )

    expect(response.isRight()).toBe(true)
    expect(isPasswordValid).toBe(true)
    expect(delivererRepository.items[0]?.password).not.toEqual(
      deliverer.password,
    )
  })

  it('should not be possible to register a deliverer with an cpf that already exists', async () => {
    const deliverer = makeDeliverer({ cpf: Cpf.create('41651534004') })
    delivererRepository.create(deliverer)

    const response = await sut.execute({
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      phoneNumber: '74973457035',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(CpfAlreadyExistsError)
  })

  it('should not be possible to register a deliverer with an email that already exists', async () => {
    const deliverer = makeDeliverer({ email: 'johnDoe@email.com' })
    delivererRepository.create(deliverer)

    const response = await sut.execute({
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      phoneNumber: '74973457035',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(EmailAlreadyExistsError)
  })
})
