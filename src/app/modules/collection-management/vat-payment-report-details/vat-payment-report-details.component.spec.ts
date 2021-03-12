import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatPaymentReportDetailsComponent } from './vat-payment-report-details.component';

describe('VatPaymentReportDetailsComponent', () => {
  let component: VatPaymentReportDetailsComponent;
  let fixture: ComponentFixture<VatPaymentReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatPaymentReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatPaymentReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
