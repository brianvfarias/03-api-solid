import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { CheckInUseCase } from '@/use-cases/checkin';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInUseCase(checkInsRepository);
	})

	it('should be able to check in', async () => {
		const	{checkIn} = await sut.execute({
			gymID: 'gym-01',
			userID: 'user-01'
		})

		expect(checkIn.id).toEqual(expect.any(String));
	})
})
