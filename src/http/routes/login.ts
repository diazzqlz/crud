import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

interface LoginRequestBody {
  email: string
  password: string
}

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string()
      }),
      response: {
        200: z.object({
          token: z.string(),
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest<{Body: LoginRequestBody}>, reply: FastifyReply) => {
    
      const { email, password } = request.body

      const user  = await prisma.user.findUnique({
        where: {
          email: email
        }
      })

      if (!user) {
        throw new Error("user not found.")
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if(!passwordMatch) {
        throw new Error("password incorrect")
      }

      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        console.error('jwt key not defined');
        throw new Error('jwt key not defined')
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' })

      return reply.status(200).send({ token, message: "user logged."});
  })
}