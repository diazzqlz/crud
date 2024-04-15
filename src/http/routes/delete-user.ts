import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete("/users/:id", {
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      response: {
        200: z.object({
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    const { id } = request.params
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token || typeof token !== 'string') {
      reply.status(401).send({ message: 'authentication token not provided.' });
      return;
    }

      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        throw new Error('jwt key not defined')
      }

      const decodedToken = jwt.verify(token, jwtSecret) as { id: string }

      if(decodedToken.id !== id) {
        throw new Error("you don't have permission to delete this user.")
      }

      const userExists = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!userExists) {
        throw new Error("user not found.")
      }

      await prisma.user.delete({
        where: {
          id: id
        }
      });

      return reply.status(200).send({ message: "user deleted."})
  })
}
