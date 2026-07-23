import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { envSchema } from './src/infra/env/env'

const env = envSchema.parse(process.env)

export default defineConfig({
  schema: 'src/infra/prisma/schema.prisma',
  migrations: {
    path: 'src/infra/prisma/migrations',
  },
  datasource: {
    url: env.DATABASE_URL,
  },
})
