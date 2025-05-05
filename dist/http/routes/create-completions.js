"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompletionRoute = void 0;
const zod_1 = require("zod"); //usa pra fazer validação
const crerate_goal_completion_1 = require("../../functions/crerate-goal-completion");
const createCompletionRoute = async (app) => {
    app.post('/completions', {
        schema: {
            // ta usando o schema do zod aqui nessa opção para validar os atributos
            body: zod_1.z.object({
                goalId: zod_1.z.string()
            }),
        },
    }, async (request) => {
        const { goalId } = request.body;
        await (0, crerate_goal_completion_1.createGoalsCompletions)({
            goalId,
        });
    });
};
exports.createCompletionRoute = createCompletionRoute;
