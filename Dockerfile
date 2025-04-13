# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa final (imagem leve)
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --omit=dev

CMD ["node", "dist/http/server.js"]
