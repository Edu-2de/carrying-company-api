import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { DatabaseModule } from '@/infra/database/database.module'
import { ManagerFactory } from '@/test/factories/make-manager'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate Manager (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let hasher: BcryptHasher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, BcryptHasher],
    }).compile()

    app = moduleRef.createNestApplication()
    managerFactory = moduleRef.get(ManagerFactory)
    hasher = moduleRef.get(BcryptHasher)
    await app.init()
  })

  test('[POST] /managers/sessions', async () => {
    const passwordHash = await hasher.hash('password123456')

    const manager = await managerFactory.makePrismaManager({
      name: 'John Doe',
      cpf: Cpf.create('13174052181'),
      password: passwordHash,
    })

    const response = await request(app.getHttpServer())
      .post('/managers/sessions')
      .send({
        cpf: manager.cpf.value,
        password: 'password123456',
      })

    expect(response.statusCode).toBe(201)
  })
})
