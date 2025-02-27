# Portfolio Backend API

API REST para gerenciamento do portfólio, desenvolvida com Node.js, Express, TypeScript e Prisma.

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma (ORM)
- SQLite (desenvolvimento)
- Jest (testes)

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/        # Configurações do servidor
│   ├── controllers/   # Controladores das rotas
│   ├── models/       # Modelos do banco de dados
│   ├── routes/       # Definição das rotas
│   ├── services/     # Lógica de negócio
│   ├── utils/        # Funções utilitárias
│   ├── middleware/   # Middlewares da aplicação
│   └── app.ts       # Configuração do Express
└── prisma/
    └── schema.prisma # Schema do banco de dados
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
cd backend
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em modo produção
- `npm test`: Executa os testes
- `npm run lint`: Executa o linter
- `npm run lint:fix`: Corrige problemas do linter
- `npm run prisma:studio`: Abre o Prisma Studio
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Executa as migrações do banco
- `npm run prisma:deploy`: Deploy das migrações

## Endpoints da API

### Projetos

- `GET /api/projects`: Lista todos os projetos
- `GET /api/projects/featured`: Lista projetos em destaque
- `GET /api/projects/:id`: Obtém um projeto específico
- `POST /api/projects`: Cria um novo projeto
- `PUT /api/projects/:id`: Atualiza um projeto
- `DELETE /api/projects/:id`: Remove um projeto

### Formato dos Dados

#### Projeto
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "imageUrl": "string?",
  "liveUrl": "string?",
  "githubUrl": "string?",
  "technologies": "string[]",
  "featured": "boolean",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

## Desenvolvimento

Para iniciar o desenvolvimento:

1. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

2. O servidor estará rodando em `http://localhost:3001`

3. Use o Prisma Studio para gerenciar os dados:
```bash
npm run prisma:studio
```

## Testes

Execute os testes com:

```bash
npm test
```

## Documentação Adicional

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)