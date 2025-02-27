import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/AppError';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Erro interno do servidor'
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message
  });
};