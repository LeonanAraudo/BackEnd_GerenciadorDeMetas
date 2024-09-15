import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createGoalRoute } from './routes/create-goal'
import { createCompletionRoute } from './routes/create-completions'
import { getPendingGoalsRoute } from './routes/get-pendding-goals'
import { getWeekSummaryRoute } from './routes/get-week-sumary'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(createGoalRoute)  //aqui ele ta criando o plugin, que seria permitir que as rotas estejam em arquivos diferentes
app.register(createCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(fastifyCors,{
  origin: "*" //Isso permite que o front acesse o back, em produção coloque a url do seu ao inves de *
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server runing')
  })
