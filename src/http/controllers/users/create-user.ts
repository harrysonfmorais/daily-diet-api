import { UserAlreadyExitsError } from '@/use-cases/errors/user-already-exists'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Create an user',
        tags: ['users'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        // response: {
        //   201: z.null(),
        // },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      try {
        const registerUseCase = makeRegisterUseCase()

        await registerUseCase.execute({
          name,
          email,
          password,
        })
      } catch (err) {
        if (err instanceof UserAlreadyExitsError) {
          return reply.status(409).send({ message: err.message })
        }

        throw err
      }

      return reply.status(201).send()
    },
  )
}
