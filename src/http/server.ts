import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";

const app = fastify()

app.register(createUser)
app.register(login)

app.listen({ port: 3333}).then(() => {
  console.log("HTTP Server running!")
})