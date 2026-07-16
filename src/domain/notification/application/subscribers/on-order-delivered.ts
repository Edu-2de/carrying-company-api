import { DomainEvents } from '@/core/events/domain-events'
import { OrderDeliveredEvent } from '@/domain/delivery/enterprise/events/order-delivered-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderDelivered {
  constructor(private sendNotification: SendNotificationUseCase) {}

  setupSubscriptions() {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'A sua encomenda foi entregue!',
      content: `A encomenda "${order.title}" foi entregue no seu destino com sucesso.`,
    })
  }
}
