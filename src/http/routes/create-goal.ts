import { z } from 'zod'; //usa pra fazer validação
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoals } from '../../functions/create-goal';

export  const createGoalRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/goals',
        {
          schema: {
            // ta usando o schema do zod aqui nessa opção para validar os atributos
            body: z.object({
              title: z.string(),
              desiredWeeklyFrequency: z.number().int().min(1).max(7),
            }),
          },
        },
        async request => {
          const { title, desiredWeeklyFrequency } = request.body
          await createGoals({
            title,
            desiredWeeklyFrequency,
          })
        }
      )
};