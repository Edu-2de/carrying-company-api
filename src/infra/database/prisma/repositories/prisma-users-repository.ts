import { UserRepository } from '@/domain/delivery/application/repositories/user-repository'
import { User } from '@/domain/delivery/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })
    if (!user) return null
    return PrismaUserMapper.toDomain(user)
  }
}
