import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  cpf: string
  email: string
  password: string
  phoneNumber: string
  address: string
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

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get phoneNumber() {
    return this.props.phoneNumber
  }

  get address() {
    return this.props.address
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
