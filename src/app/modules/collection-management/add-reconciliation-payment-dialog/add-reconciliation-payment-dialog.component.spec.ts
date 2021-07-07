import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReconciliationPaymentDialogComponent } from './add-reconciliation-payment-dialog.component';

describe('AddReconciliationPaymentDialogComponent', () => {
  let component: AddReconciliationPaymentDialogComponent;
  let fixture: ComponentFixture<AddReconciliationPaymentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReconciliationPaymentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReconciliationPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
