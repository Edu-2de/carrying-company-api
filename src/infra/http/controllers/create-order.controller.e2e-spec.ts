import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from '@/test/factories/make-recipient'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Order (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)
    await app.init()
  })

  test('[POST] /orders', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
    })

    const response = await request(app.getHttpServer()).post('/orders').send({
      title: 'title',
      latitude: -9.52608,
      longitude: -43.6041,
      expectedDate: new Date(),
      recipientId: recipient.id.toString(),
    })

    expect(response.statusCode).toBe(201)
  })
})
