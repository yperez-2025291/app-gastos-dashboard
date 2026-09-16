import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { BudgetComponent } from './features/budget/budget.component';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { EmergencyFundComponent } from './features/emergency-fund/emergency-fund.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Layout y rutas privadas protegidas por el guardián de autenticación
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'gastos', component: ExpensesComponent },
      { path: 'presupuesto', component: BudgetComponent },
      { path: 'presupuesto-emergencia', component: EmergencyFundComponent },
      { path: 'fondo-emergencia', redirectTo: 'presupuesto-emergencia', pathMatch: 'full' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirección ante rutas no existentes
  { path: '**', redirectTo: 'login' }
];