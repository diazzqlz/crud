import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import { Params } from "../../types/params";

let passwordUpdated = false

export async function updatePassword(app: FastifyInstance) {
  app.patch("/users/:id", async (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply) => {
    const { id } = request.params

    if (passwordUpdated) {
      return reply.status(400).send({ message: "you already updated your password."})
    }

    const updateSchemaBody = z.object({
      password: z.string().min(5),
      newPassword: z.string().min(5)
    })

    try {
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

    passwordUpdated = true

    return reply.status(200).send({ message: "password updated"})
  } catch (error) {
    return reply.status(500).send({ message: "error updating user password. "})
  }
  })
}

