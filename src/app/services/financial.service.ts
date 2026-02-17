import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardData, Transaction, TransactionType } from '../models/financial.model';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FinancialService {
    private apiUrl = 'http://localhost:3000/financial';

    dashboardData = signal<DashboardData | null>(null);
    loading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    fetchDashboardData(): void {
        this.loading.set(true);
        this.http.get<DashboardData>(`${this.apiUrl}/dashboard`)
            .pipe(tap(() => this.loading.set(false)))
            .subscribe(data => this.dashboardData.set(data));
    }

    getTransactions(category: string, type: TransactionType): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, {
            params: { category, type }
        });
    }
}
