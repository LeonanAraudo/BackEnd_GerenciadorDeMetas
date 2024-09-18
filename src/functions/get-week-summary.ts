import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'
import { createGoalsCompletions } from './crerate-goal-completion'

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

  //Pega a lista de todas as metas que completei
  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        completedAt: goalCompletions.createdAt, //vai ter a data completa com horario
        completedAtDate: sql`
        DATE(${goalCompletions.createdAt}) 
        `.as('completedAtDate'), //vai pegar somente a data sem horario
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
  )

  //vai pegar os dados da goalsCompletedInweek e agrupa-los pela data
  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: sql`
       JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ${goalsCompletedInWeek.id},
          'title', ${goalsCompletedInWeek.title},
          'completedAt', ${goalsCompletedInWeek.completedAt}
        )
       )
      `.as('completions'),
        //As informações do bd estão todas soltas, ao realizar esse select vou fazer um objeto com uma data, e dentro desse objeto vai ter um atributo com os array de objetos,que no caso seriam as metas referentes a aquela data
        //JSON_AGG pega o retorno do postgres e converte em array
        //JSON_BUILD_OBJECT vai criar o objeto
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate)) //para organizar os dias da semana na ordem certa
  )
  type GoalsPerDay = Record<string , {
    id:string,
    title: string,
    completedAt: string
  }[]>
  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number), // ta pegando a quantidade de metas completadas
      total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number), //ta pegando a quatidade de vezes em que as metas devem ser feita na semana e soamando-as
      goalsPerDay: sql<GoalsPerDay>`JSON_OBJECT_AGG(
       ${goalsCompletedByWeekDay.completedAtDate},
       ${goalsCompletedByWeekDay.completions}
      )`
    })
    .from(goalsCompletedByWeekDay)

  return {
    summary: result[0],
  }
}
