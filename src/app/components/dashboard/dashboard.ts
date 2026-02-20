import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
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
    MatIconModule,
    RouterModule,
    KpiCardV2Component,
    ApexChartComponent
  ],
  template: `
  <div style=" padding: 40px 40px 0 40px;"> 
    <img routerLink="/" src="./arrow-left.svg" alt="" style="cursor: pointer;">
  </div>
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

        <!-- NOVOS INDICADORES DE RECEITA E DESPESA -->
        <div class="indicators-row animate-slide-up" style="animation-delay: 0.2s;margin-top:84px">
          <!-- SEÇÃO RECEITA -->
          <div class="indicator-group incomes glass-card">
            <div class="group-header">
              <h3>Indicadores de Receita</h3>
            </div>
            
            <div class="indicator-sections">
              <div class="sub-section">
                <h4>3 Maiores Clientes</h4>
                <div class="mini-ranking">
                  <div class="ranking-item" *ngFor="let client of data.topReceivableEntities.slice(0, 3); let i = index">
                    <span class="rank-name">{{ client.entity }}</span>
                    <span class="rank-value">{{ client.total | currency:'BRL' }}</span>
                  </div>
                </div>
              </div>

              <div class="sub-section">
                <h4>Picos de Recebimento</h4>
                <div class="date-list">
                  <div class="date-item" *ngFor="let date of data.topReceivableDates">
                    <span class="date-label">{{ date.date | date:'dd/MM/yyyy' }}</span>
                    <span class="date-value">{{ date.total | currency:'BRL' }}</span>
                  </div>
                </div>
              </div>

              <div class="conclusion-box">
                <p>{{ data.conclusionIncomes }}</p>
              </div>
            </div>
          </div>

          <!-- SEÇÃO DESPESA -->
          <div class="indicator-group expenses glass-card">
            <div class="group-header">
              <h3>Indicadores de Despesa</h3>
            </div>
            
            <div class="indicator-sections">
              <div class="sub-section">
                <h4>3 Maiores Fornecedores</h4>
                <div class="mini-ranking">
                  <div class="ranking-item" *ngFor="let supplier of data.topPayableEntities.slice(0, 3); let i = index">
                    <span class="rank-name">{{ supplier.entity }}</span>
                    <span class="rank-value">{{ supplier.total | currency:'BRL' }}</span>
                  </div>
                </div>
              </div>

              <div class="sub-section">
                <h4>Picos de Pagamentos</h4>
                <div class="date-list">
                  <div class="date-item" *ngFor="let date of data.topPayableDates">
                    <span class="date-label">{{ date.date | date:'dd/MM/yyyy' }}</span>
                    <span class="date-value">{{ date.total | currency:'BRL' }}</span>
                  </div>
                </div>
              </div>

              <div class="conclusion-box">
                <p>{{ data.conclusionExpenses }}</p>
              </div>
            </div>
          </div>
        </div>

        <section class="ranking-section animate-slide-up" style="animation-delay: 0.3s">
          <div class="glass-card ranking-card">
            <div class="card-header">
              <h3>Distribuição por Centro de Custos</h3>
              <button class="btn-text">Ver todos</button>
            </div>
            <div class="ranking-list">
              <div class="ranking-item-full" *ngFor="let cat of data.topPayableCategories.slice(0, 5); let i = index">
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
    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .btn-back {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #4a5568;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .btn-back:hover {
      background: #f7fafc;
      color: #3182ce;
      border-color: #3182ce;
      transform: translateX(-4px);
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
    .ranking-item-full { display: flex; align-items: center; gap: 20px; }
    .rank-num { font-size: 1.2rem; font-weight: 800; color: #cbd5e0; width: 24px; }
    .rank-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .rank-label { font-weight: 600; font-size: 0.95rem; color: #2d3748; }
    .rank-bar-container { height: 8px; background: #edf2f7; border-radius: 10px; overflow: hidden; }
    .rank-bar { height: 100%; background: linear-gradient(90deg, #3182ce, #63b3ed); border-radius: 10px; }
    .rank-stats { display: flex; flex-direction: column; align-items: flex-end; width: 120px; }
    .rank-value { font-weight: 700; color: #2d3748; }
    .rank-perc { font-size: 0.8rem; color: #a0aec0; }

    /* New Indicator Styles */
    .indicators-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 30px;
    }
    .indicator-group {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .group-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #f7fafc;
      padding-bottom: 15px;
    }
    .group-header h3 { margin: 0; font-size: 1.3rem; font-weight: 700; }
    .income-icon { color: #2e7d32; }
    .expense-icon { color: #c62828; }
    
    .indicator-sections {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .sub-section h4 {
      margin: 0 0 12px 0;
      font-size: 0.9rem;
      text-transform: uppercase;
      color: #718096;
      letter-spacing: 0.05em;
    }
    .mini-ranking, .date-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ranking-item, .date-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: #f8fafc;
      border-radius: 12px;
      font-size: 0.95rem;
    }
    .rank-name, .date-label { font-weight: 600; color: #2d3748; }
    .rank-value, .date-value { font-weight: 700; color: #4a5568; }

    .conclusion-box {
      margin-top: 10px;
      padding: 20px;
      background: #ebf8ff;
      border-left: 4px solid #3182ce;
      border-radius: 12px;
    }
    .expenses .conclusion-box {
      background: #fff5f5;
      border-left-color: #e53e3e;
    }
    .conclusion-box p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #2d3748;
      font-weight: 500;
    }

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
