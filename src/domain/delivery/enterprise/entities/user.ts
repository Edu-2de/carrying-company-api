import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface UserProps {
  cpf: string
  password: string
  role: 'Manager' | 'Deliverer'
}

export class User extends Entity<UserProps> {
  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    return new User(props, id)
  }
}
