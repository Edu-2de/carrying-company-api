import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DelivererFactory } from '@/test/factories/make-deliverer'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate Deliverer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let hasher: BcryptHasher
  let delivererFactory: DelivererFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DelivererFactory, BcryptHasher],
    }).compile()

    app = moduleRef.createNestApplication()
    delivererFactory = moduleRef.get(DelivererFactory)
    hasher = moduleRef.get(BcryptHasher)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const hashedPassword = await hasher.hash('password123456')

    const user = await delivererFactory.makePrismaDeliverer({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: hashedPassword,
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: user.cpf.value,
      password: 'password123456',
    })

    expect(response.statusCode).toBe(201)
  })
})
