export class UserDoesNotExistsError extends Error {
  constructor() {
    super('This user does not exists')
  }
}
