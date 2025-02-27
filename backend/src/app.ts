import express from 'express';
import cors from 'cors';
import { projectsRouter } from './routes/projects';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Configuração do CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio-de-producao.com'] 
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/api/projects', projectsRouter);

// Middleware de erro deve ser o último
app.use(errorHandler);

// Rota 404 para requisições não encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada'
  });
});

export { app };