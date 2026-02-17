import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="glass-card kpi-card" [ngClass]="statusClass">
      <div class="kpi-icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="kpi-content">
        <span class="kpi-label">{{ title }}</span>
        <h2 class="kpi-value">{{ value | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</h2>
        <span class="kpi-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      flex: 1;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.3s ease;
    }
    .kpi-card:hover {
      transform: translateY(-5px);
    }
    .kpi-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(26, 35, 126, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color);
    }
    .kpi-content {
      display: flex;
      flex-direction: column;
    }
    .kpi-label {
      font-size: 0.9rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .kpi-value {
      margin: 4px 0;
      font-size: 1.8rem;
    }
    .kpi-subtitle {
      font-size: 0.8rem;
      color: #888;
    }
    .POSITIVE .kpi-icon { background: rgba(76, 175, 80, 0.1); color: var(--success-color); }
    .NEGATIVE .kpi-icon { background: rgba(244, 67, 54, 0.1); color: var(--error-color); }
    .POSITIVE .kpi-value { color: var(--success-color); }
    .NEGATIVE .kpi-value { color: var(--error-color); }
  `]
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() icon: string = 'attach_money';
  @Input() subtitle: string = '';
  @Input() statusClass: string = '';
}
