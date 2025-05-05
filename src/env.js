"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = __importDefault(require("zod"));
const envSchema = zod_1.default.object({
    DATABASE_URL: zod_1.default.string().url(),
});
exports.env = envSchema.parse(process.env);
//process.env e a variavel de ambiente que ta no .env
//quando executa o parse, ele vai verificar se o process.env vai seguir o formato de envSchema
