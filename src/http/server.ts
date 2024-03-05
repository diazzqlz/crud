import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { updatePassword } from "./routes/update-password";
import { deleteUser } from "./routes/delete-user";
import { registerTime } from "./routes/time-logs";

const app = fastify()

app.register(createUser)
app.register(login)
app.register(updatePassword)
app.register(deleteUser)
app.register(registerTime)

app.listen({ port: 3333}).then(() => {
  console.log("HTTP Server running!")
})