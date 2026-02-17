import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FinancialService } from '../../core/services/financial.service';
import { KpiCardV2Component } from '../../shared/components/kpi-card/kpi-card.component';
import { ApexChartComponent } from '../../shared/components/charts/apex-chart.component';
import { DrillDownModalComponent } from '../drill-down-modal/drill-down-modal';
import { TransactionType } from '../../core/models/financial.model';

registerLocaleData(localePt);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    KpiCardV2Component,
    ApexChartComponent
  ],
  template: `
    <div class="dashboard-wrapper">
      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="fs.loading()">
        <div class="loader"></div>
        <p>Atualizando indicadores...</p>
      </div>

      <div class="dashboard-container" *ngIf="fs.dashboardData() as data">
        <header class="dashboard-header animate-fade-in">
          <div class="header-title">
            <h1>Dashboard Financeiro</h1>
            <p class="subtitle">Visão executiva e estratégica de resultados</p>
          </div>
          <div class="health-indicator-premium" [ngClass]="data.kpis.healthStatus">
            <span class="pulse-dot"></span>
            Status: {{ data.kpis.healthMessage }}
          </div>
        </header>

        <section class="kpi-container animate-slide-up">
          <app-kpi-card-v2 
            title="Receitas" 
            [value]="data.kpis.totalReceivable" 
            icon="trending_up"
            statusClass="POSITIVE"
            subtitle="Total previsto no mês"
            [trend]="12">
          </app-kpi-card-v2>
          
          <app-kpi-card-v2 
            title="Despesas" 
            [value]="data.kpis.totalPayable" 
            icon="trending_down"
            statusClass="NEGATIVE"
            subtitle="Total acumulado no mês"
            [trend]="-5">
          </app-kpi-card-v2>

          <app-kpi-card-v2 
            title="Saldo Líquido" 
            [value]="data.kpis.netResult" 
            [icon]="data.kpis.netResult >= 0 ? 'account_balance_wallet' : 'warning'"
            [statusClass]="data.kpis.netResult >= 0 ? 'POSITIVE' : 'NEGATIVE'"
            [subtitle]="data.kpis.netResult >= 0 ? 'Operação superavitária' : 'Atenção ao fluxo de caixa'">
          </app-kpi-card-v2>
        </section>

        <div class="dashboard-grid animate-slide-up" style="animation-delay: 0.1s">
          <app-apex-chart 
            title="Performance de Recebimento" 
            subtitle="Distribuição por principais clientes"
            [series]="receivableSeries"
            [chart]="barChartConfig"
            [xaxis]="barXAxis"
            [colors]="['#1e88e5']"
            [plotOptions]="barPlotOptions"
          ></app-apex-chart>

          <app-apex-chart 
            title="Distribuição de Custos" 
            subtitle="Participação por centro de custo"
            [series]="payableSeries"
            [chart]="donutChartConfig"
            [labels]="payableLabels"
            [colors]="['#1a237e', '#0d47a1', '#1976d2', '#2196f3', '#64b5f6', '#bbdefb']"
            [legend]="{ position: 'bottom' }"
          ></app-apex-chart>
        </div>

        <section class="ranking-section animate-slide-up" style="animation-delay: 0.2s">
          <div class="glass-card ranking-card">
            <div class="card-header">
              <h3>Top 5 Centro de Custos</h3>
              <button class="btn-text">Ver todos</button>
            </div>
            <div class="ranking-list">
              <div class="ranking-item" *ngFor="let cat of data.topPayableCategories.slice(0, 5); let i = index">
                <span class="rank-num">{{ i + 1 }}</span>
                <div class="rank-info">
                  <span class="rank-label">{{ cat.category }}</span>
                  <div class="rank-bar-container">
                    <div class="rank-bar" [style.width.%]="cat.percentage"></div>
                  </div>
                </div>
                <div class="rank-stats">
                  <span class="rank-value">{{ cat.total | currency:'BRL' }}</span>
                  <span class="rank-perc">{{ cat.percentage | number:'1.1-1' }}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      position: relative;
      min-height: 100vh;
      padding: 40px;
    }
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
    }
    .header-title h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .subtitle {
      color: #718096;
      margin: 4px 0 0 0;
    }

    .health-indicator-premium {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      border-radius: 30px;
      background: white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid rgba(0,0,0,0.05);
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ccc;
      position: relative;
    }
    .POSITIVE { color: #2e7d32; }
    .NEGATIVE { color: #c62828; }
    .POSITIVE .pulse-dot { background: #4caf50; }
    .NEGATIVE .pulse-dot { background: #f44336; }
    
    .pulse-dot::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: inherit;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid var(--primary-color);
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .ranking-section { margin-top: 30px; }
    .ranking-card { padding: 30px; border-radius: 20px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .card-header h3 { margin: 0; font-size: 1.2rem; }
    .btn-text { background: none; border: none; color: var(--accent-color); font-weight: 600; cursor: pointer; }
    
    .ranking-list { display: flex; flex-direction: column; gap: 20px; }
    .ranking-item { display: flex; align-items: center; gap: 20px; }
    .rank-num { font-size: 1.2rem; font-weight: 800; color: #cbd5e0; width: 24px; }
    .rank-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .rank-label { font-weight: 600; font-size: 0.95rem; color: #2d3748; }
    .rank-bar-container { height: 8px; background: #edf2f7; border-radius: 10px; overflow: hidden; }
    .rank-bar { height: 100%; background: linear-gradient(90deg, #3182ce, #63b3ed); border-radius: 10px; }
    .rank-stats { display: flex; flex-direction: column; align-items: flex-end; width: 120px; }
    .rank-value { font-weight: 700; color: #2d3748; }
    .rank-perc { font-size: 0.8rem; color: #a0aec0; }

    /* Animations */
    .animate-fade-in { animation: fadeIn 0.8s ease-out; }
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DashboardComponent implements OnInit {
  // Configurações ApexCharts
  receivableSeries: any[] = [];
  payableSeries: any[] = [];
  payableLabels: string[] = [];

  barChartConfig: any = { type: 'bar', height: 350, toolbar: { show: false } };
  donutChartConfig: any = { type: 'donut', height: 350 };
  barXAxis: any = { categories: [] };
  barPlotOptions: any = {
    bar: {
      borderRadius: 8,
      columnWidth: '45%',
      distributed: false
    }
  };

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
    // Recebíveis (Bar Chart)
    this.receivableSeries = [{
      name: 'Total Recebido',
      data: data.topReceivableEntities.map((e: any) => e.total)
    }];
    this.barXAxis = {
      categories: data.topReceivableEntities.map((e: any) => e.entity),
      axisBorder: { show: false },
      axisTicks: { show: false }
    };

    // Pagáveis (Donut Chart)
    this.payableSeries = data.payableByCategory.map((c: any) => c.total);
    this.payableLabels = data.payableByCategory.map((c: any) => c.category);
  }

  onEntityClick(event: any) {
    // Implementar se necessário
  }

  onCategoryClick(event: any) {
    // Implementar se necessário
  }
}
