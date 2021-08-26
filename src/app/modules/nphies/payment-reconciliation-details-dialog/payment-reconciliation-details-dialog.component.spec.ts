import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReconciliationDetailsDialogComponent } from './payment-reconciliation-details-dialog.component';

describe('PaymentReconciliationDetailsDialogComponent', () => {
  let component: PaymentReconciliationDetailsDialogComponent;
  let fixture: ComponentFixture<PaymentReconciliationDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReconciliationDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReconciliationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
