import { count, lte } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

export async function getWeekSummary() {
  const lastDayOfWeek = dayjs().endOf('week').toDate() //Retorna o ultimo dia da semana
  const firstDayOfWeek = dayjs().startOf('week').toDate() //retorna o primeiro dia da semana

  //Metas criadas durante ou antes desta semana
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek)) //quer selecionar todas as metas onde a data de criação delas seja menor ou igual ao ultimo dia da semana
  )

  // Retorna a contagem de metas conlcuidas dentro dessa semana
  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        //ta meio que fazendo um calculo de quantas vezes a meta foi concluida
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId) //ta agrupando pelo id da meta
  )

  return {
    summary: 'teste',
  }
}
