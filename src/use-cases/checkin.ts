import { UsersRepository } from '@/repositories/users-repository';
import { compare } from 'bcryptjs';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CheckInUseCaseRequest {
  userID: string;
  gymID: string;
}


interface CheckInUseCaseResponse {
  checkIn: CheckIn
}
export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userID,
    gymID
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
	  const checkIn = await this.checkInsRepository.create({
		gym_id: gymID,
		user_id: userID
	  })

	  return {
	    checkIn
	  }
  }
}
