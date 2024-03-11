import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function authenticateToken(app: FastifyInstance,) {
  app.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
      reply.status(401).send({ message: 'authentication token not provided.'})
      return reply
    }

    try {
      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        console.error('jwt key not defined');
        throw new Error('jwt key not defined')
      }

      jwt.verify(token, jwtSecret);

    } catch(err) {
      reply.status(403).send({ message: "invalid token"});
      return reply
    }
  });
}