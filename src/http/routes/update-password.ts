import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import { Params } from "../../types/params";
import jwt from 'jsonwebtoken'


export async function updatePassword(app: FastifyInstance) {
  app.patch("/users/:id", async (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply) => {
    const { id } = request.params
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token || typeof token !== 'string') {
      reply.status(401).send({ message: 'authentication token not provided.' });
      return;
    }

    const updateSchemaBody = z.object({
      password: z.string().min(5),
      newPassword: z.string().min(5)
    })

    try {

      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        console.error('jwt key not defined');
        throw new Error('jwt key not defined')
      }

      const decodedToken = jwt.verify(token, jwtSecret) as { id: string }

      if(decodedToken.id !== id) {
        reply.status(403).send({ message: "you don't have permission to delete this user."})
      }

      const { password, newPassword } = updateSchemaBody.parse(request.body);

      const userExists = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!userExists) {
        return reply.status(404).send({ message: "user not found."})
      }

      const passwordMatch = await bcrypt.compare(password, userExists.password)

      if(!passwordMatch) {
        return reply.status(401).send({ message: "current password incorrect"})
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
  } catch (error) {
    return reply.status(500).send({ message: "error updating user password. "})
  }
  })
}

