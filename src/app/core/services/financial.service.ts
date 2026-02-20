import { Injectable, signal } from '@angular/core';
import { DashboardData, Transaction, TransactionType } from '../models/financial.model';
import { Observable, of, delay, tap, map } from 'rxjs';
import { MOCK_TRANSACTIONS } from '../../data/mocks/financial.mock';

@Injectable({
    providedIn: 'root'
})
export class FinancialService {
    dashboardData = signal<DashboardData | null>(null);
    loading = signal<boolean>(false);

    // Simulando delay de rede (800ms)
    private readonly SIMULATED_DELAY = 800;

    constructor() { }

    fetchDashboardData(): void {
        this.loading.set(true);
        this.getDashboardDataFromMock()
            .pipe(
                delay(this.SIMULATED_DELAY),
                tap(() => this.loading.set(false))
            )
            .subscribe(data => this.dashboardData.set(data));
    }

    getTransactions(category: string, type: TransactionType): Observable<Transaction[]> {
        return of(MOCK_TRANSACTIONS.filter(t => t.category === category && t.type === type))
            .pipe(delay(this.SIMULATED_DELAY));
    }

    private getDashboardDataFromMock(): Observable<DashboardData> {
        const incomes = MOCK_TRANSACTIONS.filter(t => t.type === TransactionType.INCOME);
        const expenses = MOCK_TRANSACTIONS.filter(t => t.type === TransactionType.EXPENSE);

        const totalReceivable = incomes.reduce((acc, t) => acc + t.value, 0);
        const totalPayable = expenses.reduce((acc, t) => acc + t.value, 0);
        const netResult = totalReceivable - totalPayable;

        let healthStatus: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
        let healthMessage = 'Equilibrado';

        if (netResult > 0) {
            healthStatus = 'POSITIVE';
            healthMessage = 'Saudável';
        } else if (netResult < -10000) {
            healthStatus = 'NEGATIVE';
            healthMessage = 'Crítico';
        }

        const data: DashboardData = {
            kpis: {
                totalReceivable,
                totalPayable,
                netResult,
                healthStatus,
                healthMessage,
            },
            topPayableCategories: this.getTopCategories(expenses, totalPayable),
            topReceivableEntities: this.getTopEntities(incomes, totalReceivable),
            topPayableEntities: this.getTopEntities(expenses, totalPayable),
            receivableByCategory: this.getTopCategories(incomes, totalReceivable),
            payableByCategory: this.getTopCategories(expenses, totalPayable),
            topReceivableDates: this.getTopDates(incomes),
            topPayableDates: this.getTopDates(expenses),
            conclusionIncomes: this.generateConclusion(incomes, 'RECEITA'),
            conclusionExpenses: this.generateConclusion(expenses, 'DESPESA'),
        };

        return of(data);
    }

    private getTopCategories(transactions: Transaction[], total: number) {
        const categoriesMap = new Map<string, number>();
        transactions.forEach(t => {
            categoriesMap.set(t.category, (categoriesMap.get(t.category) || 0) + t.value);
        });

        return Array.from(categoriesMap.entries())
            .map(([category, value]) => ({
                category,
                total: value,
                percentage: (value / total) * 100,
            }))
            .sort((a, b) => b.total - a.total);
    }

    private getTopEntities(transactions: Transaction[], total: number) {
        const entitiesMap = new Map<string, number>();
        transactions.forEach(t => {
            entitiesMap.set(t.entity, (entitiesMap.get(t.entity) || 0) + t.value);
        });

        return Array.from(entitiesMap.entries())
            .map(([entity, value]) => ({
                entity,
                total: value,
                percentage: total > 0 ? (value / total) * 100 : 0,
            }))
            .sort((a, b) => b.total - a.total);
    }

    private getTopDates(transactions: Transaction[]) {
        const datesMap = new Map<string, number>();
        transactions.forEach(t => {
            datesMap.set(t.date, (datesMap.get(t.date) || 0) + t.value);
        });

        return Array.from(datesMap.entries())
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 3);
    }

    private generateConclusion(transactions: Transaction[], type: 'RECEITA' | 'DESPESA'): string {
        if (transactions.length === 0) return `Nenhuma ${type.toLowerCase()} registrada no período.`;

        const total = transactions.reduce((acc, t) => acc + t.value, 0);
        const topEntity = this.getTopEntities(transactions, total)[0];
        const topDate = this.getTopDates(transactions)[0];

        if (type === 'RECEITA') {
            return `A receita total é de ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, com destaque para o cliente ${topEntity.entity} que representa ${topEntity.percentage.toFixed(1)}% do volume total. O pico de recebimento ocorreu em ${new Date(topDate.date).toLocaleDateString('pt-BR')}.`;
        } else {
            return `As despesas totalizam ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, sendo que ${topEntity.entity} é o principal fornecedor (${topEntity.percentage.toFixed(1)}%). O maior volume de pagamentos foi concentrado no dia ${new Date(topDate.date).toLocaleDateString('pt-BR')}.`;
        }
    }
}
