import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-kpi-card-v2',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    template: `
    <div class="kpi-card-premium" [ngClass]="statusClass">
      <div class="kpi-gradient"></div>
      <div class="kpi-content">
        <div class="kpi-header">
          <span class="kpi-label">{{ title }}</span>       
        </div>
        <div class="kpi-body">
          <h2 class="kpi-value">
            <span class="currency">R$</span> 
            {{ value | number:'1.2-2':'pt-BR' }}
          </h2>
          <div class="kpi-footer" *ngIf="subtitle">
            <span class="kpi-subtitle">{{ subtitle }}</span>
           
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .kpi-card-premium {
      position: relative;
      flex: 1;
      min-width: 280px;
      padding: 24px;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0,0,0,0.03);
    }

    .kpi-card-premium:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .kpi-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #1565c0, #1e88e5);
    }

    .POSITIVE .kpi-gradient { background: linear-gradient(90deg, #2e7d32, #43a047); }
    .NEGATIVE .kpi-gradient { background: linear-gradient(90deg, #c62828, #e53935); }
    .WARNING .kpi-gradient { background: linear-gradient(90deg, #f57c00, #fb8c00); }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .kpi-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7fafc;
      color: #4a5568;
      transition: all 0.3s ease;
    }

    .POSITIVE .kpi-icon-wrapper { background: #f0fff4; color: #2f855a; }
    .NEGATIVE .kpi-icon-wrapper { background: #fff5f5; color: #c53030; }

    .kpi-value {
      margin: 0;
      font-size: 2.2rem;
      font-weight: 800;
      color: #1a202c;
      line-height: 1;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .currency {
      font-size: 1.2rem;
      font-weight: 600;
      color: #a0aec0;
    }

    .kpi-footer {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .kpi-subtitle {
      font-size: 0.85rem;
      color: #718096;
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: #48bb78;
    }

    .kpi-trend mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
  `]
})
export class KpiCardV2Component {
    @Input() title: string = '';
    @Input() value: number = 0;
    @Input() icon: string = 'attach_money';
    @Input() subtitle: string = '';
    @Input() statusClass: string = '';
    @Input() trend?: number;
}
