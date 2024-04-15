import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/register", {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(5)
      }),
      response: {
        201: z.object({
          user: z.object({
            id: z.string()
          })
        })
      }
    }
  }, async (request, reply) => {

    const { name, email, password } = request.body

    const emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if(emailAlreadyExists) {
      throw new Error("email already exists.")
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds) 

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash
      }
    })

    return reply.status(201).send({
      user
    })
  })
}