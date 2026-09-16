import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmergencyFundService, EmergencyFund } from '../../core/services/emergency-fund.service';

@Component({
  selector: 'app-emergency-fund',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './emergency-fund.component.html',
  styleUrls: ['./emergency-fund.component.css']
})
export class EmergencyFundComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fundService = inject(EmergencyFundService);

  fundForm!: FormGroup;
  depositForm!: FormGroup;
  
  monthlyExpenses = 0;
  targetMonths = 3;
  targetAmount = 0;
  currentAmount = 0;
  loading = false;

  ngOnInit(): void {
    this.initForms();
    this.loadFundData();
  }

  private initForms(): void {
    this.fundForm = this.fb.group({
      monthlyExpenses: [null, [Validators.required, Validators.min(1)]],
      targetMonths: [3, [Validators.required, Validators.min(1), Validators.max(24)]]
    });

    this.depositForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  loadFundData(): void {
    this.loading = true;
    this.fundService.getFund().subscribe({
      next: (data) => {
        this.monthlyExpenses = data.monthlyExpenses || 0;
        this.targetMonths = data.targetMonths || 3;
        this.targetAmount = data.targetAmount || 0;
        this.currentAmount = data.currentAmount || 0;

        this.fundForm.patchValue({
          monthlyExpenses: this.monthlyExpenses,
          targetMonths: this.targetMonths
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateTarget(): void {
    if (this.fundForm.invalid) {
      this.fundForm.markAllAsTouched();
      return;
    }

    const { monthlyExpenses, targetMonths } = this.fundForm.value;
    const calculatedTarget = monthlyExpenses * targetMonths;

    const payload = {
      monthlyExpenses: Number(monthlyExpenses),
      targetMonths: Number(targetMonths),
      targetAmount: calculatedTarget
    };

    this.fundService.updateFund(payload).subscribe({
      next: (res) => {
        this.monthlyExpenses = res.monthlyExpenses;
        this.targetMonths = res.targetMonths;
        this.targetAmount = res.targetAmount;
      }
    });
  }

  addDeposit(): void {
    if (this.depositForm.invalid) {
      this.depositForm.markAllAsTouched();
      return;
    }

    const deposit = Number(this.depositForm.value.amount);
    const newCurrentAmount = this.currentAmount + deposit;

    this.fundService.updateFund({ currentAmount: newCurrentAmount }).subscribe({
      next: (res) => {
        this.currentAmount = res.currentAmount;
        this.depositForm.reset();
      }
    });
  }

  get progressPercentage(): number {
    if (this.targetAmount <= 0) return 0;
    const percent = (this.currentAmount / this.targetAmount) * 100;
    return Math.min(Math.round(percent), 100);
  }
}