import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Coordinate } from './value-objects/coordinate'
import type { Cpf } from './value-objects/cpf'

export interface RecipientProps {
  name: string
  cpf: Cpf
  phoneNumber: string
  location: Coordinate
  createdAt: Date
  updatedAt: Date
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get phoneNumber() {
    return this.props.phoneNumber
  }

  get location() {
    return this.props.location
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: RecipientProps, id?: UniqueEntityId) {
    const recipient = new Recipient(
      {
        ...props,
      },
      id,
    )
    return recipient
  }
}
