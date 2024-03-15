import { Decimal } from '@prisma/client/runtime/library';
import { GymsRepository } from '../prisma/gyms-repository';
import { Gym } from '@prisma/client';

export class InMemoryGymRepository implements GymsRepository {
  public records: Gym[] = [];

  async findById(id: string) {
    const gym = this.records.find((r) => r.id === id);

    if (!gym) return null;

    return gym;


  }
}
