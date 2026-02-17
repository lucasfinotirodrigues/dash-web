import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FinancialService } from '../../services/financial.service';
import { KpiCardComponent } from '../kpi-card/kpi-card';
import { FinancialChartComponent } from '../financial-chart/financial-chart';
import { DrillDownModalComponent } from '../drill-down-modal/drill-down-modal';
import { TransactionType } from '../../models/financial.model';
import { ChartData } from 'chart.js';

registerLocaleData(localePt);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    KpiCardComponent,
    FinancialChartComponent
  ],
  template: `
    <div class="dashboard-container" *ngIf="fs.dashboardData() as data">
      <header class="dashboard-header">
        <h1>Dashboard Financeiro Executivo</h1>
        <div class="health-indicator" [ngClass]="data.kpis.healthStatus">
          <span class="dot"></span>
          {{ data.kpis.healthMessage }}
        </div>
      </header>

      <section class="kpi-container">
        <app-kpi-card 
          title="Total a Receber" 
          [value]="data.kpis.totalReceivable" 
          icon="trending_up"
          statusClass="POSITIVE">
        </app-kpi-card>
        
        <app-kpi-card 
          title="Total a Pagar" 
          [value]="data.kpis.totalPayable" 
          icon="trending_down"
          statusClass="NEGATIVE">
        </app-kpi-card>

        <app-kpi-card 
          title="Resultado Líquido" 
          [value]="data.kpis.netResult" 
          [icon]="data.kpis.netResult >= 0 ? 'account_balance_wallet' : 'warning'"
          [statusClass]="data.kpis.netResult >= 0 ? 'POSITIVE' : 'NEGATIVE'"
          [subtitle]="data.kpis.netResult >= 0 ? 'Superavit mensal' : 'Déficit no período'">
        </app-kpi-card>
      </section>

      <div class="dashboard-grid">
        <app-financial-chart 
          title="Recebimentos por Cliente" 
          chartType="bar"
          [chartData]="receivableChartData"
          (itemClicked)="onEntityClick($event)">
        </app-financial-chart>

        <app-financial-chart 
          title="Distribuição de Gastos" 
          chartType="doughnut"
          [chartData]="payableChartData"
          (itemClicked)="onCategoryClick($event)">
        </app-financial-chart>
      </div>

      <section class="ranking-section">
        <div class="glass-card ranking-card">
          <h3>Top 5 Centro de Custos</h3>
          <div class="ranking-item" *ngFor="let cat of data.topPayableCategories.slice(0, 5); let i = index">
            <span class="rank-num">{{ i + 1 }}</span>
            <span class="rank-label">{{ cat.category }}</span>
            <div class="rank-bar-bg">
              <div class="rank-bar" [style.width.%]="cat.percentage"></div>
            </div>
            <span class="rank-value">{{ cat.total | currency:'BRL' }}</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .health-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      background: white;
      box-shadow: var(--shadow);
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ccc;
    }
    .POSITIVE .dot { background: var(--success-color); }
    .NEGATIVE .dot { background: var(--error-color); }
    .NEUTRAL .dot { background: var(--warning-color); }

    .ranking-section {
      margin-top: 30px;
    }
    .ranking-card {
      padding: 24px;
    }
    .ranking-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 12px;
    }
    .rank-num {
      width: 24px;
      font-weight: 700;
      color: var(--primary-color);
    }
    .rank-label {
      width: 200px;
      font-size: 0.9rem;
    }
    .rank-bar-bg {
      flex: 1;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
    }
    .rank-bar {
      height: 100%;
      background: var(--accent-color);
      border-radius: 4px;
    }
    .rank-value {
      width: 100px;
      text-align: right;
      font-weight: 600;
      font-size: 0.9rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  receivableChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  payableChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  constructor(public fs: FinancialService, private dialog: MatDialog) {
    effect(() => {
      const data = this.fs.dashboardData();
      if (data) {
        this.updateCharts(data);
      }
    });
  }

  ngOnInit() {
    this.fs.fetchDashboardData();
  }

  updateCharts(data: any) {
    this.receivableChartData = {
      labels: data.topReceivableEntities.map((e: any) => e.entity),
      datasets: [{
        label: 'Total Recebido',
        data: data.topReceivableEntities.map((e: any) => e.total),
        backgroundColor: '#2979ff',
        borderRadius: 8
      }]
    };

    this.payableChartData = {
      labels: data.payableByCategory.map((c: any) => c.category),
      datasets: [{
        data: data.payableByCategory.map((c: any) => c.total),
        backgroundColor: [
          '#1a237e', '#0d47a1', '#1976d2', '#2196f3', '#64b5f6', '#bbdefb'
        ]
      }]
    };
  }

  onEntityClick(event: any) {
    this.fs.getTransactions(event.label, TransactionType.INCOME).subscribe(transactions => {
      this.dialog.open(DrillDownModalComponent, {
        data: { category: event.label, transactions },
        width: '800px'
      });
    });
  }

  onCategoryClick(event: any) {
    this.fs.getTransactions(event.label, TransactionType.EXPENSE).subscribe(transactions => {
      this.dialog.open(DrillDownModalComponent, {
        data: { category: event.label, transactions },
        width: '800px'
      });
    });
  }
}
