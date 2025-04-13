FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Garante a instalação com devDependencies
RUN npm install

COPY . .

# Executa o build com npx
RUN npx tsc

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --omit=dev

CMD ["node", "dist/http/server.js"]
