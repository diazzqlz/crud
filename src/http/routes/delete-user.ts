import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { Unauthorized } from "./_errors/unauthorized";
import { NotFound } from "./_errors/not-found";

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete("/users/:id", {
    schema: {
      summary: "delete an user",
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
      throw new Unauthorized('authentication token not provided.' )
    }

      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        throw new Unauthorized('jwt key not defined')
      }

      const decodedToken = jwt.verify(token, jwtSecret) as { id: string }

      if(decodedToken.id !== id) {
        throw new Unauthorized("you don't have permission to delete this user.")
      }

      const userExists = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!userExists) {
        throw new NotFound("user not found.")
      }

      await prisma.user.delete({
        where: {
          id: id
        }
      });

      return reply.status(200).send({ message: "user deleted."})
  })
}
