import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/users/:userId', {
    schema: {
      summary: 'Get an user',
      params: z.object({
        userId: z.string().uuid()
      }),
      response: {
        200: z.object({
          user: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email()
          })
        })
      }
    }
  }, async (request: FastifyRequest<{Params: {userId: string}}>, reply: FastifyReply) => {
      const { userId } = request.params

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      })

      if(user === null) {
        throw new BadRequest("user not found.")
      }

      reply.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })

      console.log(user)
  })
}