import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto'


export class InMemoryUsersRepository implements UsersRepository {
  public records: User[] = [];
  async findByID(id: string): Promise<User | null> {
    const user = this.records.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.records.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.records.push(user);
    return user;
  }
}
