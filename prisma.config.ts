import { envSchema } from '@/infra/env/env'
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const env = envSchema.parse(process.env)

export default defineConfig({
  schema: 'src/infra/prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env.DATABASE_URL,
  },
})
