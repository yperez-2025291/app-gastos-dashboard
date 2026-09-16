import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './database/prisma.service.js';
import usersRoutes from './modules/users/users.router.js';
import budgetRoutes from './modules/budget/budget.router.js';
import expensesRoutes from './modules/expenses/expenses.routes.js';
import emergencyFundRoutes from './modules/emergency-fund/emergency-fund.router.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      message: 'Backend API y Base de Datos PostgreSQL conectadas correctamente',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al conectar con la base de datos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Rutas de Módulos
app.use('/api/users', usersRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/emergency-fund', emergencyFundRoutes);

export default app;