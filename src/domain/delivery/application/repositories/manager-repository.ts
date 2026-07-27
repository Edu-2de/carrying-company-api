import { Manager } from '../../enterprise/entities/manager'

export abstract class ManagerRepository {
  abstract create(data: Manager): Promise<void>
  abstract findByCpf(cpf: string): Promise<Manager | null>
}
