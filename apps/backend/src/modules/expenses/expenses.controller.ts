import { Request, Response } from 'express';
import { prisma } from '../../database/prisma.service.js';

export const getExpenses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
      include: {
        category: true,
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los gastos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, amount, date, categoryId, userId } = req.body;

    if (!amount) {
      res.status(400).json({ message: 'El campo "amount" es obligatorio' });
      return;
    }

    let targetUserId = userId || (req.headers['x-user-id'] as string);
    if (!targetUserId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        res.status(400).json({ message: 'No hay usuarios en la base de datos' });
        return;
      }
      targetUserId = fallbackUser.id;
    }

    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      let defaultCategory = await prisma.category.findFirst({
        where: { userId: targetUserId },
      });

      if (!defaultCategory) {
        defaultCategory = await prisma.category.create({
          data: {
            name: 'General',
            userId: targetUserId,
          },
        });
      }
      targetCategoryId = defaultCategory.id;
    }

    const newExpense = await prisma.expense.create({
      data: {
        title: title || description || 'Gasto sin título',
        description: description || title || '',
        amount: Number(amount),
        date: date ? new Date(date) : new Date(),
        userId: targetUserId,
        categoryId: targetCategoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error al crear gasto en backend:', error);
    res.status(400).json({
      message: 'Error al registrar el gasto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;

    if (!id) {
      res.status(400).json({ message: 'El ID del gasto es requerido' });
      return;
    }

    await prisma.expense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: 'Error al eliminar el gasto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};