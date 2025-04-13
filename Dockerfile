# Etapa 1: Build
FROM node:18-alpine AS builder

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Executa o build da aplicação (por exemplo, se for Vite)
RUN npm run build


# Etapa 2: Produção
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Porta que a aplicação vai usar
EXPOSE 3000

# Comando de start da aplicação (ajuste se for diferente)
CMD ["npm", "run", "preview"]
