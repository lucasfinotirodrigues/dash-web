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
    receivableByCategory: CategorySummary[];
    payableByCategory: CategorySummary[];
}
