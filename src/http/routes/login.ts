import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'

export async function login(app: FastifyInstance) {
  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const loginSchemaBody = z.object({
      email: z.string().email(),
      password: z.string()
    })

    try { 
      const { email, password } = loginSchemaBody.parse(request.body)

      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      })
      

      if (!user) {
        return reply.status(400).send({ message: "user not found."})
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if(!passwordMatch) {
        return reply.status(400).send({ message: "password incorrect"})
      }

      return reply.status(200).send({ message: "user logged"});
  } catch (error) {
      reply.status(400).send({ message: 'incorrect input data'})
    }
  })
}