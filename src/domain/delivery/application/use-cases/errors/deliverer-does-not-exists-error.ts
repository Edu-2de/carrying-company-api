export class DelivererDoesNotExistsError extends Error {
  constructor() {
    super('This deliverer does not exists')
  }
}
