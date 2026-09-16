import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from './expenses.controller.js';

const router = Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

export default router;