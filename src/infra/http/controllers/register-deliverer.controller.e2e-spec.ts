import { AppModule } from '@/infra/app.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Register Deliverer (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('[POST] /deliverers', async () => {
    const response = await request(app.getHttpServer())
      .post('/deliverers')
      .send({
        name: 'John Doe',
        cpf: '26652428504',
        email: 'johnDoe@email.com',
        password: 'password123456',
        phoneNumber: '96980657046',
      })

    expect(response.statusCode).toBe(201)
  })
})
