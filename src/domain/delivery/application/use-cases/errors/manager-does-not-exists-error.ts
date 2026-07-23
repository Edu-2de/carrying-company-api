export class ManagerDoesNotExistsError extends Error {
  constructor() {
    super('Manager does not exists')
  }
}
