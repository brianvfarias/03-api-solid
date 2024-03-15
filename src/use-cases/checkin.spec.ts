import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from '@/use-cases/checkin';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		gymsRepository.records.push({
			id: 'gym-01',
			phon: '',
			title: 'Test gym',
			latitude: new Decimal(0),
			longitude: new Decimal(0),
			description: ''
		})
		vi.useFakeTimers();
	})

	afterEach(() => {
		vi.useRealTimers();
	})


	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymID: 'gym-01',
			userID: 'user-01',
			userLatitude: 0,
			userLongitude: 0.
		})

		expect(checkIn.id).toEqual(expect.any(String));
	})
	it('should not be able to cheeck-in twice in the same day', async () => {
		vi.setSystemTime(new Date(2024, 2, 11, 8, 0, 0))
		await sut.execute({
			gymID: 'gym-01',
			userID: 'user-01',
			userLatitude: 0,
			userLongitude: 0.
		})

		await expect(async () => {
			return await sut.execute({
				userID: 'user-01',
				gymID: 'gym-01',
				userLatitude: 0,
				userLongitude: 0.

			});
		}).rejects.toBeInstanceOf(Error);

	})

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2024, 2, 10, 8, 0, 0))
		await sut.execute({
			gymID: 'gym-01',
			userID: 'user-01',
			userLatitude: 0,
			userLongitude: 0.
		})
		vi.setSystemTime(new Date(2024, 2, 11, 8, 0, 0))
		const { checkIn } = await sut.execute({
			userID: 'user-01',
			gymID: 'gym-01',
			userLatitude: 0,
			userLongitude: 0.
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

})
