import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema' // o arquivo la tem varios schemas aqui ele vai pegar todas as exportações de la e jogar dentro de uma variavel schema
import { env } from '../env'

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client,{ schema, logger: true })