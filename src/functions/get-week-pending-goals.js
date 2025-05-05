"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekPedingGoals = getWeekPedingGoals;
// Rota para retornar as metas pendentes da semana
const dayjs_1 = __importDefault(require("dayjs"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function getWeekPedingGoals() {
    const lastDayOfWeek = (0, dayjs_1.default)().endOf('week').toDate(); //Retorna o ultimo dia da semana
    const firstDayOfWeek = (0, dayjs_1.default)().startOf('week').toDate(); //retorna o primeiro dia da semana
    console.log(lastDayOfWeek.toISOString());
    //funcionalidade de retornar todas as metas criadas até esta semana
    const goalsCreatedUpToWeek = db_1.db.$with('goals_created_up_to_week').as(db_1.db
        .select({
        id: schema_1.goals.id,
        title: schema_1.goals.title,
        desiredWeeklyFrequency: schema_1.goals.desiredWeeklyFrequency,
        createdAt: schema_1.goals.createdAt,
    })
        .from(schema_1.goals)
        .where((0, drizzle_orm_1.lte)(schema_1.goals.createdAt, lastDayOfWeek)) //quer selecionar todas as metas onde a data de criação delas seja menor ou igual ao ultimo dia da semana
    );
    // Retorna a contagem de metas conlcuidas dentro dessa semana
    const goalCompletionCounts = db_1.db.$with('goal_completion_counts').as(db_1.db
        .select({
        //ta meio que fazendo um calculo de quantas vezes a meta foi concluida
        goalId: schema_1.goalCompletions.goalId,
        completionCount: (0, drizzle_orm_1.count)(schema_1.goalCompletions.id).as('completionCount'),
    })
        .from(schema_1.goalCompletions)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createdAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createdAt, lastDayOfWeek)))
        .groupBy(schema_1.goalCompletions.goalId) //ta agrupando pelo id da meta
    );
    const penddingGoals = await db_1.db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
        // aqui está organizando os dados para a pesquisa ter masi nexo
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desireWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: (0, drizzle_orm_1.sql) `
      COALESCE(${goalCompletionCounts.completionCount}, 0)` //ta pegando as vezes em que a meta foi feita e meio que fazendo um if para que seja exibido 0 caso o valor seja null
            .mapWith(Number), //ta transformando esse 0 em um Number
    })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalCompletionCounts, (0, drizzle_orm_1.eq)(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)); // ta retornando a meta e a quantidade de vezes que essa meta foi feita na semana
    return { penddingGoals };
}
