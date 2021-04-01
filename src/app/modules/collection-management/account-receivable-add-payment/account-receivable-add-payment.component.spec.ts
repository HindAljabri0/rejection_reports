import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableAddPaymentComponent } from './account-receivable-add-payment.component';

describe('AccountReceivableAddPaymentComponent', () => {
  let component: AccountReceivableAddPaymentComponent;
  let fixture: ComponentFixture<AccountReceivableAddPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableAddPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableAddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
