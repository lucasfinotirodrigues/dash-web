import { Transaction, TransactionType } from '../../core/models/financial.model';

export const MOCK_TRANSACTIONS: Transaction[] = [
    // Recebimentos - Jan/2026 (Total: 38.795,92)
    { id: '1', date: '2026-01-05', description: 'receita de Serviços', category: 'Serviços', value: 38795.92, type: TransactionType.INCOME, entity: 'Clientes' },
       // Pagamentos - Jan/2026 (Total: 59.032,01)
    { id: '5', date: '2026-01-02', description: 'Retirada Pró-labore', category: 'Despesas Pessoais dos Sócios', value: 20000.00, type: TransactionType.EXPENSE, entity: 'Sócio 1' },
    { id: '6', date: '2026-01-05', description: 'Folha de Pagamento', category: 'Salários', value: 15000.00, type: TransactionType.EXPENSE, entity: 'Funcionarios' },
    { id: '7', date: '2026-01-15', description: 'Adiantamento Quinzenal', category: 'Adiantamento Salarial', value: 7000.00, type: TransactionType.EXPENSE, entity: 'Funcionarios' },
    { id: '8', date: '2026-01-10', description: 'Compra de Servidores', category: 'Máquinas e Equipamentos', value: 10000.00, type: TransactionType.EXPENSE, entity: 'Dell Tech' },
    { id: '9', date: '2026-01-25', description: 'Parcela Empréstimo', category: 'Empréstimos Bancários', value: 7032.01, type: TransactionType.EXPENSE, entity: 'Banco Itau' },
];
