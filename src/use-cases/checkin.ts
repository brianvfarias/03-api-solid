// import { UsersRepository } from '@/repositories/users-repository';
// import { compare } from 'bcryptjs';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/prisma/checkins-repository';
import { GymsRepository } from '@/repositories/prisma/gyms-repository';
// 
interface CheckInUseCaseRequest {
	userID: string;
	gymID: string;
	userLongitude: number;
	userLatitude: number;
}


interface CheckInUseCaseResponse {
	checkIn: CheckIn
}
export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository
	) { }



	async execute({
		userID,
		gymID
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymID);

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIDOnDate(userID, new Date());



		if (checkInOnSameDay) {
			throw new Error();
		}
		const checkIn = await this.checkInsRepository.create({
			gym_id: gymID,
			user_id: userID
		})

		return {
			checkIn
		}
	}
}
