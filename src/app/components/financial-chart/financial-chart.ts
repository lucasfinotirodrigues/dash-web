import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, registerables, Chart } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-financial-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="glass-card chart-card">
      <h3>{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas baseChart
                [data]="chartData"
                [options]="chartOptions"
                [type]="chartType"
                (chartClick)="onChartClick($event)">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      padding: 24px;
      height: 100%;
    }
    .chart-wrapper {
      display: block;
      height: 300px;
    }
    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 1.1rem;
      color: #555;
    }
  `]
})
export class FinancialChartComponent {
  @Input() title: string = '';
  @Input() chartType: ChartType = 'pie';
  @Input() chartData!: ChartData<any>;
  @Output() itemClicked = new EventEmitter<any>();

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  onChartClick(event: any): void {
    if (event.active && event.active.length > 0) {
      const index = event.active[0].index;
      const label = this.chartData.labels?.[index];
      const value = this.chartData.datasets[0].data[index];
      this.itemClicked.emit({ label, value });
    }
  }
}
