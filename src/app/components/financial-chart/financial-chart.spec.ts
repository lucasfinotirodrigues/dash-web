import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialChart } from './financial-chart';

describe('FinancialChart', () => {
  let component: FinancialChart;
  let fixture: ComponentFixture<FinancialChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
