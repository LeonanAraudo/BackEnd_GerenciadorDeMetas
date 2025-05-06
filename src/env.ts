import z from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})

try {
  export const env = envSchema.parse(process.env)
} catch (error) {
  console.error("Erro de validação de ambiente:", error.errors)
  process.exit(1)
}


//process.env e a variavel de ambiente que ta no .env
//quando executa o parse, ele vai verificar se o process.env vai seguir o formato de envSchema
