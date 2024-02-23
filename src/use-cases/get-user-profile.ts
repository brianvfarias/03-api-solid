import { UsersRepository } from '@/repositories/users-repository';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseRequest {
  userID: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userID,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findByID(userID);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
