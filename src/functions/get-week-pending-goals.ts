// Rota para retornar as metas pendentes da semana
import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, lte, sql, count, gte, eq } from 'drizzle-orm'


export async function getWeekPedingGoals() {
  const lastDayOfWeek = dayjs().endOf('week').toDate() //Retorna o ultimo dia da semana
  const firstDayOfWeek = dayjs().startOf('week').toDate() //retorna o primeiro dia da semana

  console.log(lastDayOfWeek.toISOString())
  //funcionalidade de retornar todas as metas criadas até esta semana
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


  const penddingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      // aqui está organizando os dados para a pesquisa ter masi nexo
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desireWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql`
      COALESCE(${goalCompletionCounts.completionCount}, 0)` //ta pegando as vezes em que a meta foi feita e meio que fazendo um if para que seja exibido 0 caso o valor seja null
        .mapWith(Number), //ta transformando esse 0 em um Number
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    ) // ta retornando a meta e a quantidade de vezes que essa meta foi feita na semana
  return { penddingGoals }
}
