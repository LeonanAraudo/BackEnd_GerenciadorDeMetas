# 🌌 in.orbit – Gerenciador de Metas

Este é o back-end do projeto **in.orbit**, uma aplicação moderna para gerenciamento de metas, construída com foco em performance, organização e escalabilidade.


🔗 Acesse a aplicação: [in.orbit - Vercel](https://inorbit-leoproject.vercel.app/)
## ⚙️ Como rodar o projeto na sua maquina
### 1. Clone o repositório
```bash
git clone https://github.com/LeonanAraudo/BackEnd_GerenciadorDeMetas
```
### 2. Crie um arquivo .env na raiz com suas variáveis de ambiente, como:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/nome_do_banco
```
### 3. Instale as dependência
```bash
npm install
# ou
yarn
```
### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```
O projeto será iniciado em: http://localhost:3333
## 🚀 Tecnologias Utilizadas

- **Drizzle ORM** – Utilizado para realizar consultas ao banco de dados de forma segura e tipada.
  
  ![image](https://github.com/user-attachments/assets/051048eb-1aee-4dd2-a1f8-62eda290f031)
<br>
<br>
- **Day.js** – Biblioteca leve e poderosa para manipulação de datas e horários.

  ![image](https://github.com/user-attachments/assets/e3b0e3d9-eaa8-4e41-b7b3-c50cf45bba4c)
<br>
<br>
- **Zod** – Responsável pela validação de dados de entrada, garantindo segurança e previsibilidade nas requisições.
  
  ![image](https://github.com/user-attachments/assets/eb2e85c5-41aa-46cd-9feb-4b809864387b)
<br>
<br>
- **Fastify + fastify-cors** – Framework web rápido e leve, utilizado para criação de rotas com alta performance. O `fastify-cors` é usado para permitir acesso seguro da API a partir de outras origens (CORS).
  
  ![image](https://github.com/user-attachments/assets/01fe4295-920a-45e7-bf48-c1afded5f6bb)
<br>
<br>
- **PostgreSQL + Docker** -O banco de dados foi construído com PostgreSQL e executado em ambiente isolado com Docker, garantindo portabilidade, facilidade de setup e consistência entre os ambientes.  
<br>
<br>

## 🔗 Front-end do projeto
👉 https://github.com/LeonanAraudo/FrontEnd_GerenciadorDeMetas



    
