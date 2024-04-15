import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequest } from "./http/routes/_errors/bad-request";
import { Unauthorized } from "./http/routes/_errors/unauthorized";
import { NotFound } from "./http/routes/_errors/not-found";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'error during validation.',
      errors: error.flatten().fieldErrors
    })
  }

  if(error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message})
  }

  if(error instanceof Unauthorized) {
    return reply.status(401).send({ message: error.message})
  }

  if (error instanceof NotFound) {
    return reply.status(404).send({ message: error.message})
  }

  return reply.status(500).send({ message: 'um erro aconteceu'})
}