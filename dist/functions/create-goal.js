"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoals = createGoals;
const schema_1 = require("../db/schema");
const db_1 = require("../db");
async function createGoals({ title, desiredWeeklyFrequency }) {
    const result = await db_1.db.insert(schema_1.goals).values({
        title,
        desiredWeeklyFrequency,
    })
        .returning();
    const goal = result[0];
    return { goal };
}
