"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoalRoute = void 0;
const zod_1 = require("zod"); //usa pra fazer validação
const create_goal_1 = require("../../functions/create-goal");
const createGoalRoute = async (app) => {
    app.post('/goals', {
        schema: {
            // ta usando o schema do zod aqui nessa opção para validar os atributos
            body: zod_1.z.object({
                title: zod_1.z.string(),
                desiredWeeklyFrequency: zod_1.z.number().int().min(1).max(7),
            }),
        },
    }, async (request) => {
        const { title, desiredWeeklyFrequency } = request.body;
        await (0, create_goal_1.createGoals)({
            title,
            desiredWeeklyFrequency,
        });
    });
};
exports.createGoalRoute = createGoalRoute;
