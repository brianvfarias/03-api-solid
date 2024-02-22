import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { RegisterUseCase } from './register';

let userRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe('Authentica Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();

    sut = new AuthenticateUseCase(userRepository);
  });
  it('should be able to authenticate', async () => {
    await userRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('1234567', 6),
      name: 'John Doe',
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '1234567',
    });

    expect(user.id).toBeTypeOf('string');
  });

  it('should not be able to authenticate with an incorrect e-mail', async () => {
    expect(
      async () =>
        await sut.execute({
          email: 'johndoe@test.com.',
          password: '1234567',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with an incorrect e-mail', async () => {
    await userRepository.create({
      name: 'John Doe',
      password_hash: await hash('123123', 6),
      email: 'johndoe@test.com',
    });

    expect(
      async () =>
        await sut.execute({
          email: 'johndoe@test.com.',
          password: '1234567',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
