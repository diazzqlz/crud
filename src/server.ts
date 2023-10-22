import fastify from "fastify";
import { userRoutes } from './routes/user-routes'
import { contactsRoutes } from './routes/contact-routes'

const server = fastify()

server.register(userRoutes, {
  prefix: 'users'
})

server.register(contactsRoutes, {
  prefix: 'contacts'
})

server.listen({
  port: 3333
}).then(() => {
  console.log("HTTP Server Running!")
})