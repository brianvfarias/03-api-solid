// import { UsersRepository } from '@/repositories/users-repository';
// import { compare } from 'bcryptjs';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/prisma/checkins-repository';
import { GymsRepository } from '@/repositories/prisma/gyms-repository';
import { getDistanceBetweenCoordinates } from './utils/get-distance-between-coordinates';
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
		gymID,
		userLatitude,
		userLongitude
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymID);

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIDOnDate(userID, new Date());


		if (checkInOnSameDay) {
			throw new Error();
		}


		const distance = getDistanceBetweenCoordinates({ latitude: userLatitude, longitude: userLongitude }, { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() });
		console.log(distance);

		const MAX_DISTANCE = 0.1;


		if (distance > MAX_DISTANCE) {
			throw (new Error());
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
