import { FastifyInstance } from 'fastify'
import { createUser } from './users/create-user'
import { authenticate } from './users/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.register(createUser)
  app.register(authenticate)

  /** Authentitate */
}
