import { it, describe, expect } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());
    const { user } = await registerUseCase.execute({
      name: 'Brian Farias Teste',
      email: 'briandoe@example.com',
      password: 'aStrongPassword',
    });

    expect(user.id).toBeTypeOf('string');
  });
  it('should hash user password upon user registration', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());
    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);
    const email = 'johndoe@test.com';
    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: 'senhamuitotop',
    });

    await expect(async () => {
      await registerUseCase.execute({
        name: 'John Doe',
        email,
        password: 'senhamuitotop',
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
