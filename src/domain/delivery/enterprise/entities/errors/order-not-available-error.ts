export class OrderNotAvailableError extends Error {
  constructor() {
    super('Order is not available for this action.')
  }
}
