import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, it } from 'vitest'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'
import { RegisterRecipientUseCase } from './register-recipient'

let recipientRepository: InMemoryRecipientRepository
let sut: RegisterRecipientUseCase

describe('Register Recipient Use Case', () => {
  beforeEach(async () => {
    recipientRepository = new InMemoryRecipientRepository()
    sut = new RegisterRecipientUseCase(recipientRepository)
  })

  it('should be able to register a recipient', async () => {
    const recipient = {
      name: 'JohnDoe',
      cpf: '94394081033',
      phoneNumber: '71992178921',
      latitude: -10.8302,
      longitude: -42.7308,
    }

    const response = await sut.execute(recipient)
    expect(response.isRight()).toBe(true)
    expect(recipientRepository.items).toHaveLength(1)
    expect(recipientRepository.items[0]?.name).toEqual(recipient.name)
  })

  it('should not be possible to register a recipient with an cpf that already exists', async () => {
    const recipient = makeRecipient({ cpf: Cpf.create('94394081033') })
    recipientRepository.create(recipient)

    const response = await sut.execute({
      name: 'JohnDoe',
      cpf: '94394081033',
      phoneNumber: '71992178921',
      latitude: -10.8302,
      longitude: -42.7308,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(CpfAlreadyExistsError)
  })
})
