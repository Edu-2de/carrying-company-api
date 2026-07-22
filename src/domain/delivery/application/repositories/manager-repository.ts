import type { Manager } from '../../enterprise/entities/manager'

export interface ManagerRepository {
  create(data: Manager): Promise<void>
  findByCpf(cpf: string): Promise<Manager | void>
}
