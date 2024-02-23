import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import exp from 'constants';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({ userID: createdUser.id });

    expect(user.id).toBeTypeOf('string');
    expect(user.name).toEqual('John Doe');
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(async () => {
      return await sut.execute({
        userID: 'user-1',
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
