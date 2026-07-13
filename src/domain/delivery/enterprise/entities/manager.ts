import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Cpf } from './value-objects/cpf'

export interface ManagerProps {
  name: string
  cpf: Cpf
  email: string
  password: string
  phoneNumber: string
  createdAt: Date
  updatedAt: Date
}

export class Manager extends Entity<ManagerProps> {
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

  static create(props: ManagerProps, id?: UniqueEntityId) {
    const manager = new Manager(
      {
        ...props,
      },
      id,
    )
    return manager
  }
}
