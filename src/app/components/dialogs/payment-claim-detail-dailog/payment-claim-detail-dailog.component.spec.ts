import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentClaimDetailDailogComponent } from './payment-claim-detail-dailog.component';

describe('PaymentClaimDetailDailogComponent', () => {
  let component: PaymentClaimDetailDailogComponent;
  let fixture: ComponentFixture<PaymentClaimDetailDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentClaimDetailDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentClaimDetailDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
