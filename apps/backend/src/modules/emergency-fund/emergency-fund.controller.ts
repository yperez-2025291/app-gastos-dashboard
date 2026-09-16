import { Request, Response } from 'express';
import { prisma } from '../../database/prisma.service.js';

export const getEmergencyFund = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'];

    if (!userId) {
      res.status(200).json({
        monthlyExpenses: 0,
        targetMonths: 3,
        targetAmount: 0,
        currentAmount: 0
      });
      return;
    }

    let fund = await prisma.emergencyFund.findUnique({
      where: { userId: String(userId) }
    });

    if (!fund) {
      fund = await prisma.emergencyFund.create({
        data: {
          userId: String(userId),
          monthlyExpenses: 0,
          targetMonths: 3,
          targetAmount: 0,
          currentAmount: 0
        }
      });
    }

    res.status(200).json(fund);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el fondo de emergencia',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateEmergencyFund = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'];
    const { monthlyExpenses, targetMonths, currentAmount } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'Usuario no identificado' });
      return;
    }

    const calculatedTarget = Number(monthlyExpenses || 0) * Number(targetMonths || 0);

    const updatedFund = await prisma.emergencyFund.upsert({
      where: { userId: String(userId) },
      update: {
        monthlyExpenses: Number(monthlyExpenses),
        targetMonths: Number(targetMonths),
        targetAmount: calculatedTarget,
        currentAmount: Number(currentAmount)
      },
      create: {
        userId: String(userId),
        monthlyExpenses: Number(monthlyExpenses),
        targetMonths: Number(targetMonths),
        targetAmount: calculatedTarget,
        currentAmount: Number(currentAmount)
      }
    });

    res.status(200).json(updatedFund);
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el fondo de emergencia',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};