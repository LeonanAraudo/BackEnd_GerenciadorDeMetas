"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const create_goal_1 = require("./routes/create-goal");
const create_completions_1 = require("./routes/create-completions");
const get_pendding_goals_1 = require("./routes/get-pendding-goals");
const get_week_sumary_1 = require("./routes/get-week-sumary");
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)().withTypeProvider();
app.register(create_goal_1.createGoalRoute); //aqui ele ta criando o plugin, que seria permitir que as rotas estejam em arquivos diferentes
app.register(create_completions_1.createCompletionRoute);
app.register(get_pendding_goals_1.getPendingGoalsRoute);
app.register(get_week_sumary_1.getWeekSummaryRoute);
app.register(cors_1.default, {
    origin: "*" //Isso permite que o front acesse o back, em produção coloque a url do seu ao inves de *
});
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app
    .listen({
    port: 3333,
})
    .then(() => {
    console.log('HTTP server runing');
});
