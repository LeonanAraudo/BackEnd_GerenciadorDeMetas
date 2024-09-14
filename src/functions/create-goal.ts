import { goals } from '../db/schema'
import { db } from '../db'

interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoals({title,desiredWeeklyFrequency}: CreateGoalRequest ){ //aqui ele ta acessando o interface e desestruturando os valores

    const result = await db.insert(goals).values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

    const goal = result[0]
    return { goal }
}
