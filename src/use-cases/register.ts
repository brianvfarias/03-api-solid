import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsErrors } from './errors/user-already-exists-error';
interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const foundByEmail = await this.usersRepository.findByEmail(email);

    if (foundByEmail) {
      throw new UserAlreadyExistsErrors();
    }

    // const prismaUsersRepository = new PrismaUsersRepository();
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
