import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Coordinate } from './value-objects/coordinate'
import type { Cpf } from './value-objects/cpf'

export interface DelivererProps {
  name: string
  cpf: Cpf
  email: string
  password: string
  phoneNumber: string
  createdAt?: Date
  updatedAt?: Date
  location?: Coordinate
}

export class Deliverer extends Entity<DelivererProps> {
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get location() {
    return this.props.location
  }

  static create(props: DelivererProps, id?: UniqueEntityId) {
    const deliverer = new Deliverer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return deliverer
  }
}
