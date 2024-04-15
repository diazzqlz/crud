import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { updatePassword } from "./routes/update-password";
import { deleteUser } from "./routes/delete-user";
import { authenticateToken } from "../middleware/authenticateToken";

import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser)
app.register(login)
app.register(updatePassword, authenticateToken)
app.register(deleteUser, authenticateToken)

app.listen({ port: 3333}).then(() => {
  console.log("HTTP Server running!")
})