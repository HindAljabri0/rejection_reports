import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationAddPaymentComponent } from './reconciliation-add-payment.component';

describe('ReconciliationAddPaymentComponent', () => {
  let component: ReconciliationAddPaymentComponent;
  let fixture: ComponentFixture<ReconciliationAddPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationAddPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationAddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
