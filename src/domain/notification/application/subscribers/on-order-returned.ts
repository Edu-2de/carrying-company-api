import { DomainEvents } from '@/core/events/domain-events'
import { OrderReturnedEvent } from '@/domain/delivery/enterprise/events/order-returned-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderReturned {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscription()
  }

  setupSubscription() {
    DomainEvents.register(
      this.sendOrderPickedNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendOrderPickedNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'A sua encomenda foi devolvida!',
      content: `A encomenda "${order.title}" foi devolvida com sucesso. `,
    })
  }
}
