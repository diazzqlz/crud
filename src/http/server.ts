import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { updatePassword } from "./routes/update-password";
import { deleteUser } from "./routes/delete-user";
import { authenticateToken } from "../middleware/authenticateToken";

import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler } from "../error-handler";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { getUser } from "./routes/get-users";


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'crud',
      description: 'um crud simples criado com fins de colocar em prática o que aprendi.',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser)
app.register(login)
app.register(updatePassword, authenticateToken)
app.register(deleteUser, authenticateToken)
app.register(getUser)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333}).then(() => {
  console.log("HTTP Server running!")
})