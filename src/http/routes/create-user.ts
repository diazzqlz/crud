import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'

export async function createUser(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const createUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(5)
    })

    const { name, email, password } = createUserBody.parse(request.body)  

    const emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if(emailAlreadyExists) {
      return reply.status(400).send({ message: "email already exists." })
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