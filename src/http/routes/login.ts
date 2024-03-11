import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

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

      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        console.error('chave jwt nao definida');
        throw new Error('chave jwt nao definida')
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' })

      return reply.status(200).send({ token, message: "user logged"});
  } catch (error) {
      reply.status(400).send({ message: 'incorrect input data'})
    }
  })
}