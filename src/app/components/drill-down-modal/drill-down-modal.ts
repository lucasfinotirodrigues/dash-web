import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Transaction } from '../../core/models/financial.model';

@Component({
  selector: 'app-drill-down-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule],
  template: `
    <h2 mat-dialog-title>Detalhes: {{ data.category }}</h2>
    <mat-dialog-content>
      <table mat-table [dataSource]="data.transactions" class="mat-elevation-z0">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Data </th>
          <td mat-cell *matCellDef="let element"> {{ element.date | date:'dd/MM/yyyy' }} </td>
        </ng-container>

        <ng-container matColumnDef="entity">
          <th mat-header-cell *matHeaderCellDef> Cliente/Fornecedor </th>
          <td mat-cell *matCellDef="let element"> {{ element.entity }} </td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef> Descrição </th>
          <td mat-cell *matCellDef="let element"> {{ element.description }} </td>
        </ng-container>

        <ng-container matColumnDef="value">
          <th mat-header-cell *matHeaderCellDef> Valor </th>
          <td mat-cell *matCellDef="let element"> {{ element.value | currency:'BRL' }} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    table { width: 100%; }
    .mat-mdc-dialog-content { min-width: 600px; }
  `]
})
export class DrillDownModalComponent {
  displayedColumns: string[] = ['date', 'entity', 'description', 'value'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { category: string, transactions: Transaction[] }) { }
}
