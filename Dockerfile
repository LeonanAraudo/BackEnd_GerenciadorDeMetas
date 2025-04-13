FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Corrige permissões no tsc
RUN chmod +x ./node_modules/.bin/tsc

# Executa build
RUN npx tsc

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --omit=dev

CMD ["node", "dist/http/server.js"]
