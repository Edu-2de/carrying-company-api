import { AppModule } from '@/infra/app.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create recipient account (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('[POST] /recipients', async () => {
    const response = await request(app.getHttpServer())
      .post('/recipients')
      .send({
        name: 'John Doe',
        cpf: '76256188110',
        phoneNumber: '67969102642',
        latitude: -9.52608,
        longitude: -43.6041,
      })

    expect(response.statusCode).toBe(201)
  })
})
