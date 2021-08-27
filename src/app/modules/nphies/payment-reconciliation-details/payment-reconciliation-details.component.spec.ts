import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReconciliationDetailsComponent } from './payment-reconciliation-details.component';

describe('PaymentReconciliationDetailsComponent', () => {
  let component: PaymentReconciliationDetailsComponent;
  let fixture: ComponentFixture<PaymentReconciliationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentReconciliationDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReconciliationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
