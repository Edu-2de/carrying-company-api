import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterRecipientController } from './controllers/register-recipient.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterRecipientController],
  providers: [RegisterRecipientUseCase],
})
export class HttpModule {}
