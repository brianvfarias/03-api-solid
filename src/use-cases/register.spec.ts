import { it, describe, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let userRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(userRepository);
  });

  it('should be able to register', async () => {
    sut = new RegisterUseCase(userRepository);
    const { user } = await sut.execute({
      name: 'Brian Farias Teste',
      email: 'briandoe@example.com',
      password: 'aStrongPassword',
    });

    expect(user.id).toBeTypeOf('string');
  });
  it('should hash user password upon user registration', async () => {
    const sut = new RegisterUseCase(new InMemoryUsersRepository());
    const { user } = await sut.execute({
      name: 'Brian Farias Teste',
      email: 'briandoe@example.com',
      password: 'aStrongPassword',
    });

    const passwordWasCorrectlyHashed = await compare(
      'aStrongPassword',
      user.password_hash
    );

    expect(passwordWasCorrectlyHashed).toBe(true);
  });
  it('should not be able to register with the same email twice', async () => {
    const email = 'johndoe@test.com';
    await sut.execute({
      name: 'John Doe',
      email,
      password: 'senhamuitotop',
    });

    await expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email,
        password: 'senhamuitotop',
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
