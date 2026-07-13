export class CpfAlreadyExistsError extends Error {
  constructor() {
    super('Cpf Already Exists')
  }
}
