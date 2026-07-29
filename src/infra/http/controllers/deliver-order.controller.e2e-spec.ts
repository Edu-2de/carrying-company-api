import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import { OrderFactory } from '@/test/factories/make-order'
import { RecipientFactory } from '@/test/factories/make-recipient'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Deliverer Order (E2E)', () => {
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

  test('[POST] /order/:id/deliver', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      delivererId: deliverer.id,
      status: OrderStatus.inTransit,
    })

    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fileName: 'file',
      })

    expect(response.statusCode).toBe(204)
  })
})
