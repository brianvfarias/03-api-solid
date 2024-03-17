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
			latitude: new Decimal(-3.8127456),
			longitude: new Decimal(-38.6231777),
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
			userLatitude: -3.8133278,
			userLongitude: -38.6225732
		})

		expect(checkIn.id).toEqual(expect.any(String));
	})
	it('should not be able to cheeck-in twice in the same day', async () => {
		vi.setSystemTime(new Date(2024, 2, 11, 8, 0, 0))
		await sut.execute({
			gymID: 'gym-01',
			userID: 'user-01',
			userLatitude: -3.8133278,
			userLongitude: -38.6225732
		})

		await expect(async () => {
			return await sut.execute({
				userID: 'user-01',
				gymID: 'gym-01',
				userLatitude: -3.8133278,
				userLongitude: -38.6225732

			});
		}).rejects.toBeInstanceOf(Error);

	})

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2024, 2, 10, 8, 0, 0))
		await sut.execute({
			gymID: 'gym-01',
			userID: 'user-01',
			userLatitude: -3.8133278,
			userLongitude: -38.6225732
		})
		vi.setSystemTime(new Date(2024, 2, 11, 8, 0, 0))
		const { checkIn } = await sut.execute({
			userID: 'user-01',
			gymID: 'gym-01',
			userLatitude: -3.8133278,
			userLongitude: -38.6225732
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gyms', async () => {

		await expect(() => sut.execute({
			userID: 'user-01',
			gymID: 'gym-01',
			userLongitude: -40.6244259,
			userLatitude: -3.8133039
		})).rejects.toBeInstanceOf(Error)
	})

})
