import { z } from 'zod'; //usa pra fazer validação
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoalsCompletions } from '../../functions/crerate-goal-completion';

export  const createCompletionRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/completions',
        {
          schema: {
            // ta usando o schema do zod aqui nessa opção para validar os atributos
            body: z.object({
              goalId: z.string()
            }),
          },
        },
        async request => {
          const { goalId } = request.body
          await createGoalsCompletions({
          goalId,
          })
        }
      )
      
};