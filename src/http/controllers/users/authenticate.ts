import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        summary: 'Authenticate an user',
        tags: ['users'],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        // response: {
        //   201: z.null(),
        // },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      try {
        const authenticateUseCase = makeAuthenticateUseCase()

        await authenticateUseCase.execute({
          email,
          password,
        })
      } catch (err) {
        if (err instanceof InvalidCredentialsError) {
          return reply.status(409).send({ message: err.message })
        }

        throw err
      }

      return reply.status(200).send()
    },
  )
}
