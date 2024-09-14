import fastify from 'fastify'
import { createGoals } from '../functions/create-goal'
import z from 'zod' //usa pra fazer validação
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: { // ta usando o schema do zod aqui nessa opção para validar os atributos
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },

  async request => {
    const {title,desiredWeeklyFrequency } = request.body
    await createGoals({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server runing')
  })
