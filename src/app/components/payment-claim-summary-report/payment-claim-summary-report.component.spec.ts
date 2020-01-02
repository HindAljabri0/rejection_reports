import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentClaimSummaryReportComponent } from './payment-claim-summary-report.component';

describe('PaymentClaimSummaryReportComponent', () => {
  let component: PaymentClaimSummaryReportComponent;
  let fixture: ComponentFixture<PaymentClaimSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentClaimSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentClaimSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
