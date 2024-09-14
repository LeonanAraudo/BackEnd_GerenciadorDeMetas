import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})
export const env = envSchema.parse(process.env)

//process.env e a variavel de ambiente que ta no .env
//quando executa o parse, ele vai verificar se o process.env vai seguir o formato de envSchema
