"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekSummary = getWeekSummary;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const dayjs_1 = __importDefault(require("dayjs"));
async function getWeekSummary() {
    const lastDayOfWeek = (0, dayjs_1.default)().endOf('week').toDate(); //Retorna o ultimo dia da semana
    const firstDayOfWeek = (0, dayjs_1.default)().startOf('week').toDate(); //retorna o primeiro dia da semana
    //Metas criadas durante ou antes desta semana
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
    //Pega a lista de todas as metas que completei
    const goalsCompletedInWeek = db_1.db.$with('goals_completed_in_week').as(db_1.db
        .select({
        id: schema_1.goals.id,
        title: schema_1.goals.title,
        completedAt: schema_1.goalCompletions.createdAt, //vai ter a data completa com horario
        completedAtDate: (0, drizzle_orm_1.sql) `
        DATE(${schema_1.goalCompletions.createdAt}) 
        `.as('completedAtDate'), //vai pegar somente a data sem horario
    })
        .from(schema_1.goalCompletions)
        .innerJoin(schema_1.goals, (0, drizzle_orm_1.eq)(schema_1.goals.id, schema_1.goalCompletions.goalId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.goalCompletions.createdAt))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createdAt, firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createdAt, lastDayOfWeek))));
    //vai pegar os dados da goalsCompletedInweek e agrupa-los pela data
    const goalsCompletedByWeekDay = db_1.db.$with('goals_completed_by_week_day').as(db_1.db
        .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: (0, drizzle_orm_1.sql) `
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
        .orderBy((0, drizzle_orm_1.desc)(goalsCompletedInWeek.completedAtDate)) //para organizar os dias da semana na ordem certa
    );
    const result = await db_1.db
        .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select({
        completed: (0, drizzle_orm_1.sql) `(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number), // ta pegando a quantidade de metas completadas
        total: (0, drizzle_orm_1.sql) `(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number), //ta pegando a quatidade de vezes em que as metas devem ser feita na semana e soamando-as
        goalsPerDay: (0, drizzle_orm_1.sql) `JSON_OBJECT_AGG(
       ${goalsCompletedByWeekDay.completedAtDate},
       ${goalsCompletedByWeekDay.completions}
      )`
    })
        .from(goalsCompletedByWeekDay);
    return {
        summary: result[0],
    };
}
