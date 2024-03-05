import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { Params } from "../../types/params";

export async function deleteUser(app: FastifyInstance) {
  app.delete("/users/:id", async (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply) => {
    const { id } = request.params

    try {
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
      return reply.status(500).send({ message: "error deleting user. "})
  }
  })
}

