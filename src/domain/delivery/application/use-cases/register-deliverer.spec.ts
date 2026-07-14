import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import { RegisterDelivererUseCase } from './register-deliverer'

let sut: RegisterDelivererUseCase
let delivererRepository: DelivererRepository

describe('Register Deliverer Use Case', () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    sut = new RegisterDelivererUseCase(delivererRepository)
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

  it('should not be possible to register a deliverer with an email that already exists', async () => {
    const deliverer = {
      name: 'John Doe',
      cpf: '41651534004',
      email: 'johnDoe@email.com',
      password: 'password123456',
      latitude: -10.8302,
      longitude: -42.7308,
      phoneNumber: '74973457035',
    }
  })
})
