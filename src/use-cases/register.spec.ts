import { it, describe, expect } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';

describe('Register Use Case', () => {
  it('should hash user password upon user registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
    });

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
});
