import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { Unauthorized } from "../http/routes/_errors/unauthorized";

export async function authenticateToken(app: FastifyInstance,) {
  app.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
      throw new Unauthorized('authentication token not provided.')
    }

    try {
      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        throw new Unauthorized('jwt key not defined')
      }

      jwt.verify(token, jwtSecret);

    } catch(err) {
      throw new Unauthorized("invalid token")
    }
  });
}