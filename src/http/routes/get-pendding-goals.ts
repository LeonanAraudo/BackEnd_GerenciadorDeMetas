import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPedingGoals } from '../../functions/get-week-pending-goals';

export  const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
    app.get('/pendding-goals', async () => {
        const {penddingGoals} = await getWeekPedingGoals()
      
        return {penddingGoals}
      })
      
};