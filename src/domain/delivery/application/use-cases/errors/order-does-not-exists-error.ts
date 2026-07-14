export class OrderDoesNotExistsError extends Error {
  constructor() {
    super('This order does not exists')
  }
}
