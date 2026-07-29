import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { OrderFactory } from '@/test/factories/make-order'
import { RecipientFactory } from '@/test/factories/make-recipient'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Near Orders (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let delivererFactory: DelivererFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DelivererFactory, OrderFactory, JwtService],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)
    delivererFactory = moduleRef.get(DelivererFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /orders/near', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const order1 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      delivererId: deliverer.id,
      location: Coordinate.create(-30.0421, -51.2211),
    })
    const order2 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      delivererId: deliverer.id,
      location: Coordinate.create(-30.0253, -51.2211),
    })

    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/orders/near')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ latitude: -30.0346, longitude: -51.2177 })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ recipientId: recipient.id.toString() }),
        expect.objectContaining({ recipientId: recipient.id.toString() }),
      ]),
    })
  })
})
