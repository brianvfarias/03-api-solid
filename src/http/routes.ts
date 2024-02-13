import { register } from './controller/register';
import { FastifyInstance } from 'fastify';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
}
