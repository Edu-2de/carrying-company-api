import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create manager account (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('[POST] /managers', async () => {
    const response = await request(app.getHttpServer()).post('/managers').send({
      name: 'John Doe',
      cpf: '23552516140',
      email: 'johnDoe1@email.com',
      password: 'password123',
      phoneNumber: '64985423281',
    })

    expect(response.statusCode).toBe(201)
  })
})
