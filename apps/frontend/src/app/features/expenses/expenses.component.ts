import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../core/models/expense.model';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);

  expenses: Expense[] = [];
  expenseForm!: FormGroup;
  loading = false;

  ngOnInit(): void {
    this.initForm();
    this.loadExpenses();
  }

  private initForm(): void {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar gastos:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const formValues = this.expenseForm.value;

    const payload = {
      title: formValues.title,
      description: formValues.description || formValues.title,
      amount: Number(formValues.amount),
      date: formValues.date ? new Date(formValues.date).toISOString() : new Date().toISOString()
    };

    this.expenseService.addExpense(payload).subscribe({
      next: (createdExpense) => {
        this.expenses.unshift(createdExpense);
        this.expenseForm.reset({
          date: new Date().toISOString().substring(0, 10)
        });
      },
      error: (err) => {
        console.error('Error detallado del servidor:', err);
      }
    });
  }

  deleteExpense(id: string): void {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter((item) => item.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar el gasto:', err);
      }
    });
  }

  get totalAmount(): number {
    return this.expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }
}