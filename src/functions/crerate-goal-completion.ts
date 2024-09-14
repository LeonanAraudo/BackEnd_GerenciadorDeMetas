//marcar que completou uma meta
import { goalCompletions, goals } from '../db/schema'
import { db } from '../db'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalsCompletions({
  goalId,
}: CreateGoalCompletionRequest) {
  
  const lastDayOfWeek = dayjs().endOf('week').toDate() //Retorna o ultimo dia da semana
  const firstDayOfWeek = dayjs().startOf('week').toDate() //retorna o primeiro dia da semana

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
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId) //ta usando pra filtrar as metas, par a pesquisar retornar somente o que foi solicitado
        )
      )
      .groupBy(goalCompletions.goalId) //ta agrupando pelo id da meta
  )

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desireWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
      COALESCE(${goalCompletionCounts.completionCount}, 0)` //ta pegando as vezes em que a meta foi feita e meio que fazendo um if para que seja exibido 0 caso o valor seja null
        .mapWith(Number), //ta transformando esse 0 em um Number
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId)) //ta usando pra filtrar as metas, par a pesquisar retornar somente o que foi solicitado
    .limit(1) //pra só vir 1 registro

  const { completionCount, desireWeeklyFrequency } = result[0]

  if (completionCount >= desireWeeklyFrequency) {
    throw new Error('Goal already compled this week!')
  }
  const insertResult = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning()

  const goalCompletion = insertResult[0]
  return { goalCompletion }
}
