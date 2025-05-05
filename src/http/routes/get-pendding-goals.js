"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingGoalsRoute = void 0;
const get_week_pending_goals_1 = require("../../functions/get-week-pending-goals");
const getPendingGoalsRoute = async (app) => {
    app.get('/pendding-goals', async () => {
        const { penddingGoals } = await (0, get_week_pending_goals_1.getWeekPedingGoals)();
        return { penddingGoals };
    });
};
exports.getPendingGoalsRoute = getPendingGoalsRoute;
