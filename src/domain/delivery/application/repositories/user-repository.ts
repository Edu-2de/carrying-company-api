import { User } from '../../enterprise/entities/user'

export abstract class UserRepository {
  abstract findByCpf(cpf: string): Promise<User | null>
}
