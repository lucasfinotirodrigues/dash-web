import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillDownModal } from './drill-down-modal';

describe('DrillDownModal', () => {
  let component: DrillDownModal;
  let fixture: ComponentFixture<DrillDownModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrillDownModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrillDownModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
