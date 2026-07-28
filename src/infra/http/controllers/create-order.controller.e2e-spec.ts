import { AppModule } from '@/infra/app.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Order (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('[POST] /orders', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      title: 'title',
      latitude: -9.52608,
      longitude: -43.6041,
      expectedDate: new Date(),
    })
  })
})
