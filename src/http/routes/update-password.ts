import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Unauthorized } from "./_errors/unauthorized";
import { NotFound } from "./_errors/not-found";
import { BadRequest } from "./_errors/bad-request";


export async function updatePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch("/users/:id", {
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: z.object({
        password: z.string().min(5),
        newPassword: z.string().min(5)
      }),
      response: {
        200: z.object({
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest<{ Params: { id: string }, Body: { password: string, newPassword: string }}>, reply: FastifyReply) => {
    const { id } = request.params
    const { password, newPassword } = request.body
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token || typeof token !== 'string') {
      throw new Unauthorized('authentication token not provided.')
    }

      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        throw new Unauthorized('jwt key not defined')
      }

      const decodedToken = jwt.verify(token, jwtSecret) as { id: string }

      if(decodedToken.id !== id) {
        throw new Unauthorized("you don't have permission to update this user.")
      }

      const userExists = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!userExists) {
        throw new NotFound("user not found.")
      }

      const passwordMatch = await bcrypt.compare(password, userExists.password)

      if(!passwordMatch) {
        throw new BadRequest("current password incorrect")
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: {
          id: id
        },
        data: {
          password: hashedPassword
        }
      });

      return reply.status(200).send({ message: "password updated"})
   
  })
}

