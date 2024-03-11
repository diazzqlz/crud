// import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
// import { prisma } from "../../lib/prisma";
// import { Params } from "../../types/params";
// import jwt from 'jsonwebtoken'
// import 'dotenv/config'

// export async function deleteUser(app: FastifyInstance) {
//   app.delete("/users/:id", async (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply) => {
//     const { id } = request.params
//     const authHeader = request.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
    
//     if(!token || typeof token !== 'string') {
//       reply.status(401).send({ message: 'Token de autenticação não fornecido.' });
//       return;
//     }

//     try {
//       const jwtSecret = process.env.JWT_SECRET

//       if (!jwtSecret) {
//         console.error('chave jwt nao definida');
//         throw new Error('chave jwt nao definida')
//       }

//       const decodedToken = jwt.verify(token, jwtSecret) as { id: string }

//       if(decodedToken !== id) {
//         reply.status(403).send({ message: "voce nao tem permissao para excluir esse usuario."})
//         return
//       }

//       const userExists = await prisma.user.findUnique({
//         where: {
//           id: id
//         }
//       });

//       if(!userExists) {
//         return reply.status(404).send({ message: "user not found."})
//       }

//       await prisma.user.delete({
//         where: {
//           id: id
//         }
//       });

//       return reply.status(200).send({ message: "user deleted."})
//   } catch (error) {
//       return reply.status(500).send({ message: "error deleting user. "})
//   }
//   })
// }

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { Params } from "../../types/params";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function deleteUser(app: FastifyInstance) {
  app.delete("/users/:id", async (request: FastifyRequest<{ Params: Params}>, reply: FastifyReply) => {
    const { id } = request.params
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token || typeof token !== 'string') {
      reply.status(401).send({ message: 'Token de autenticação não fornecido.' });
      return;
    }

    try {
      const jwtSecret = process.env.JWT_SECRET

      if (!jwtSecret) {
        console.error('Chave JWT não definida');
        throw new Error('Chave JWT não definida')
      }

      const decodedToken = jwt.verify(token, jwtSecret) as { id: string }

      console.log(decodedToken)

      if(decodedToken.id !== id) {
        reply.status(403).send({ message: "Você não tem permissão para excluir esse usuário."})
      }

      const userExists = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!userExists) {
        return reply.status(404).send({ message: "Usuário não encontrado."})
      }

      await prisma.user.delete({
        where: {
          id: id
        }
      });

      return reply.status(200).send({ message: "Usuário deletado."})
  } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return reply.status(500).send({ message: "Erro ao deletar usuário."})
  }
  })
}
