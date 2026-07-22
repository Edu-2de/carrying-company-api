import { DomainEvents } from '@/core/events/domain-events'
import { OrderPickedEvent } from '@/domain/delivery/enterprise/events/order-picked-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderPicked {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscription()
  }

  setupSubscription() {
    DomainEvents.register(
      this.sendOrderPickedNotification.bind(this),
      OrderPickedEvent.name,
    )
  }

  private async sendOrderPickedNotification({ order }: OrderPickedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'A sua encomenda foi para a entrega!',
      content: `A encomenda "${order.title}" está em rota de entrega. `,
    })
  }
}
