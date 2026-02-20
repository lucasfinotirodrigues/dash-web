import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule],
    template: `
    <div class="home-wrapper">
      <div class="home-container">
        <header class="home-header animate-fade-in">
          <h1>Selecione um Cliente</h1>
          <p class="subtitle">Escolha o cliente para visualizar o dashboard financeiro</p>
        </header>

        <div class="client-grid animate-slide-up">
          <div class="client-card premium-card" [routerLink]="['/dashboard']">
        
            <div class="client-info">
              <h3>IVAN PILLON LTDA</h3>
              <p>22.915.917/0001-59</p>
            </div>
            <div class="client-action">
              <img src="./arrow-right.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./home.css']
})
export class HomeComponent { }
