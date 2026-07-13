import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value: string

  toString() {
    return this.value
  }

  constructor(id?: string) {
    this.value = id ?? randomUUID()
  }
}
