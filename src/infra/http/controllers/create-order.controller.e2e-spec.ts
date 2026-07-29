import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { RecipientFactory } from '@/test/factories/make-recipient'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Order (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let delivererFactory: DelivererFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DelivererFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)
    delivererFactory = moduleRef.get(DelivererFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /orders', async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer({
      name: 'John Doe2',
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'title',
        latitude: -9.52608,
        longitude: -43.6041,
        expectedDate: new Date(),
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(201)
  })
})
