import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../../lib/prisma'
import { BodyTime } from "../../types/bodytime";
import z from "zod";

export async function registerTime(app: FastifyInstance) {
  app.post("/timelogs", async (request: FastifyRequest<{Body: BodyTime}>, reply: FastifyReply) => {
    const timeLogSchema = z.object({
      userId: z.string(),
      entryTime: z.string().regex(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/),
      exitTime: z.string().regex(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/),
    });
    
    const { userId, entryTime, exitTime } = timeLogSchema.parse(request.body);


    try {
      // Salvar registro de tempo no banco de dados
      const timeLog = await prisma.timeLog.create({
        data: {
          userId: userId,
          entryTime: new Date(entryTime),
          exitTime: new Date(exitTime)
        }
      });

      reply.status(201).send({ message: "Registro de tempo salvo com sucesso.", timeLog });
    } catch (error) {
      console.error("Erro ao salvar registro de tempo:", error);
      reply.status(500).send({ message: "Erro ao salvar registro de tempo." });
    }
  });
}
