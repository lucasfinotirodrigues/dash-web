import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke,
    ApexTitleSubtitle,
    ApexYAxis,
    ApexFill,
    ApexLegend,
    ApexPlotOptions,
    ApexResponsive
} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexAxisChartSeries | any;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    colors: string[];
    labels: string[];
    legend: ApexLegend;
    subtitle: ApexTitleSubtitle;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
    fill: ApexFill;
    responsive: ApexResponsive[];
};

@Component({
    selector: 'app-apex-chart',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    template: `
    <div class="glass-card chart-card">
      <div class="chart-header">
        <h3>{{ title }}</h3>
        <span class="chart-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
      </div>
      <div class="chart-content">
        <apx-chart
          [series]="series"
          [chart]="chart"
          [xaxis]="xaxis"
          [yaxis]="yaxis"
          [title]="chartTitle"
          [plotOptions]="plotOptions"
          [dataLabels]="dataLabels"
          [stroke]="stroke"
          [colors]="colors"
          [labels]="labels"
          [legend]="legend"
          [tooltip]="tooltip"
          [fill]="fill"
          [responsive]="responsive"
          (click)="onChartClick($event)"
        ></apx-chart>
      </div>
    </div>
  `,
    styles: [`
    .chart-card {
      padding: 24px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .chart-header {
      margin-bottom: 20px;
    }
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }
    .chart-subtitle {
      font-size: 0.85rem;
      color: #666;
    }
    .chart-content {
      flex: 1;
      min-height: 300px;
    }
  `]
})
export class ApexChartComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() series: ApexAxisChartSeries | any = [];
    @Input() chart: ApexChart = { type: 'bar', height: 350 };
    @Input() xaxis: ApexXAxis = {};
    @Input() yaxis: ApexYAxis = {};
    @Input() chartTitle: ApexTitleSubtitle = {};
    @Input() plotOptions: ApexPlotOptions = {};
    @Input() dataLabels: ApexDataLabels = { enabled: false };
    @Input() stroke: ApexStroke = { show: true, width: 2 };
    @Input() colors: string[] = ['#2e7d32', '#c62828', '#1565c0'];
    @Input() labels: string[] = [];
    @Input() legend: ApexLegend = { position: 'bottom' };
    @Input() tooltip: ApexTooltip = {};
    @Input() fill: ApexFill = {};
    @Input() responsive: ApexResponsive[] = [];

    @Output() itemClicked = new EventEmitter<any>();

    onChartClick(event: any) {
        // Note: ApexCharts click handling is a bit different, 
        // often handled via 'events' in chart options. 
        // This is a simplified version.
    }
}
