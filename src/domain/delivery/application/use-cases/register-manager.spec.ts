import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeManager } from '@/test/factories/make-manager'
import { InMemoryManagerRepository } from '@/test/repositories/in-memory-manager-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'
import { RegisterManagerUseCase } from './register-manager'

let managerRepository: InMemoryManagerRepository
let hasher: FakeHasher
let sut: RegisterManagerUseCase

describe('Register Deliverer Use Case', () => {
  beforeEach(async () => {
    managerRepository = new InMemoryManagerRepository()
    hasher = new FakeHasher()
    sut = new RegisterManagerUseCase(managerRepository, hasher)
  })

  it('should be able to register a new manager', async () => {
    const manager = {
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      phoneNumber: '74973457035',
    }

    const response = await sut.execute(manager)

    expect(response.isRight()).toBe(true)
  })

  it('should be possible to generate the password hash at the time of registration', async () => {
    const manager = {
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      phoneNumber: '74973457035',
    }

    const response = await sut.execute(manager)
    const managerCreated = managerRepository.items[0]

    const isPasswordValid = await hasher.compare(
      manager.password,
      managerCreated!.password,
    )

    expect(response.isRight()).toBe(true)
    expect(isPasswordValid).toBe(true)
    expect(managerRepository.items[0]?.password).not.toEqual(manager.password)
  })

  it('should not be possible to register a manager with an cpf that already exists', async () => {
    const manager = makeManager({ cpf: Cpf.create('41651534004') })
    managerRepository.create(manager)

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
})
