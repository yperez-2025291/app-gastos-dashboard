import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmergencyFund {
  targetAmount: number;
  currentAmount: number;
  monthlyExpenses: number;
  targetMonths: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmergencyFundService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/emergency-fund';

  getFund(): Observable<EmergencyFund> {
    return this.http.get<EmergencyFund>(this.apiUrl);
  }

  updateFund(data: Partial<EmergencyFund>): Observable<EmergencyFund> {
    return this.http.post<EmergencyFund>(this.apiUrl, data);
  }
}