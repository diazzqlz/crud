# CRUD com Fastify, Prisma, TypeScript e JWT
Este é um exemplo simples de um CRUD (Create, Read, Update, Delete) desenvolvido com Fastify, Prisma, TypeScript e JWT.

### Pré-requisitos
Certifique-se de ter o Node.js instalado em sua máquina. Em seguida, clone este repositório e instale as dependências:
```bash
git clone https://github.com/diazzqlz/crud.git
cd crud
npm install
```

### Configuração
1. Crie um arquivo .env na raiz do projeto e defina a seguinte variável de ambiente:
```bash
JWT_SECRET=seu_jwt_secret_aqui
```

### Execução
```bash
npm run dev
```
O servidor será iniciado em `http://localhost:3333`.

## Rotas
### Autenticação
* **POST** /login: Rota para autenticar um usuário. Requer um corpo JSON com as credenciais do usuário (email e senha) e retorna um token JWT válido.

### Usuários
* **POST /register:** Rota para registrar um novo usuário. Requer um corpo JSON com o nome, email e senha do usuário.
* **GET /users:** Rota para obter todos os usuários cadastrados. Requer autenticação JWT.
* **PATCH /users/:id:** Rota para atualizar um usuário existente. Requer autenticação JWT.
* **DELETE /users/:id:** Rota para excluir um usuário existente. Requer autenticação JWT.
