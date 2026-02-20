export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    value: number;
    type: TransactionType;
    entity: string;
}

export interface CategorySummary {
    category: string;
    total: number;
    percentage: number;
}

export interface EntitySummary {
    entity: string;
    total: number;
    percentage: number;
}

export interface DateSummary {
    date: string;
    total: number;
}

export interface DashboardKPIs {
    totalReceivable: number;
    totalPayable: number;
    netResult: number;
    healthStatus: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    healthMessage: string;
}

export interface DashboardData {
    kpis: DashboardKPIs;
    topPayableCategories: CategorySummary[];
    topReceivableEntities: EntitySummary[];
    topPayableEntities: EntitySummary[];
    receivableByCategory: CategorySummary[];
    payableByCategory: CategorySummary[];
    topReceivableDates: DateSummary[];
    topPayableDates: DateSummary[];
    conclusionIncomes: string;
    conclusionExpenses: string;
}
