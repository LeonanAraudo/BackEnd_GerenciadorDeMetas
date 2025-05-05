"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoalsCompletions = createGoalsCompletions;
//marcar que completou uma meta
const schema_1 = require("../db/schema");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const dayjs_1 = __importDefault(require("dayjs"));
async function createGoalsCompletions({ goalId, }) {
    const lastDayOfWeek = (0, dayjs_1.default)().endOf('week').toDate(); //Retorna o ultimo dia da semana
    const firstDayOfWeek = (0, dayjs_1.default)().startOf('week').toDate(); //retorna o primeiro dia da semana
    const goalCompletionCounts = db_1.db.$with('goal_completion_counts').as(db_1.db
        .select({
        //ta meio que fazendo um calculo de quantas vezes a meta foi concluida
        goalId: schema_1.goalCompletions.goalId,
        completionCount: (0, drizzle_orm_1.count)(schema_1.goalCompletions.id).as('completionCount'),
    })
        .from(schema_1.goalCompletions)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createdAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createdAt, lastDayOfWeek), (0, drizzle_orm_1.eq)(schema_1.goalCompletions.goalId, goalId) //ta usando pra filtrar as metas, par a pesquisar retornar somente o que foi solicitado
    ))
        .groupBy(schema_1.goalCompletions.goalId) //ta agrupando pelo id da meta
    );
    const result = await db_1.db
        .with(goalCompletionCounts)
        .select({
        desireWeeklyFrequency: schema_1.goals.desiredWeeklyFrequency,
        completionCount: (0, drizzle_orm_1.sql) `
      COALESCE(${goalCompletionCounts.completionCount}, 0)` //ta pegando as vezes em que a meta foi feita e meio que fazendo um if para que seja exibido 0 caso o valor seja null
            .mapWith(Number), //ta transformando esse 0 em um Number
    })
        .from(schema_1.goals)
        .leftJoin(goalCompletionCounts, (0, drizzle_orm_1.eq)(goalCompletionCounts.goalId, schema_1.goals.id))
        .where((0, drizzle_orm_1.eq)(schema_1.goals.id, goalId)) //ta usando pra filtrar as metas, par a pesquisar retornar somente o que foi solicitado
        .limit(1); //pra só vir 1 registro
    const { completionCount, desireWeeklyFrequency } = result[0];
    if (completionCount >= desireWeeklyFrequency) {
        throw new Error('Goal already compled this week!');
    }
    const insertResult = await db_1.db
        .insert(schema_1.goalCompletions)
        .values({
        goalId,
    })
        .returning();
    const goalCompletion = insertResult[0];
    return { goalCompletion };
}
