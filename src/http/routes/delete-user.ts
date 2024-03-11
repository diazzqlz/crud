import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { Params } from "../../types/params";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function deleteUser(app: FastifyInstance) {
  app.delete("/users/:id", async (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply) => {
    const { id } = request.params
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token || typeof token !== 'string') {
      reply.status(401).send({ message: 'authentication token not provided.' });
      return;
    }

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

      const userExists = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!userExists) {
        return reply.status(404).send({ message: "user not found."})
      }

      await prisma.user.delete({
        where: {
          id: id
        }
      });

      return reply.status(200).send({ message: "user deleted."})
  } catch (error) {
      console.error('error deleting user:', error);
      return reply.status(500).send({ message: "error deleting user."})
  }
  })
}
