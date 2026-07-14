export class RecipientDoesNotExistsError extends Error {
  constructor() {
    super('This recipient does not exists')
  }
}
