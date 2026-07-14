export class DelivererNotAuthorizedError extends Error {
  constructor() {
    super('Deliverer does not match the one who picked up the order.')
  }
}
