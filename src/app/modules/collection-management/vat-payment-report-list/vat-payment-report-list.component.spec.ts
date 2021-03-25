import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatPaymentReportListComponent } from './vat-payment-report-list.component';

describe('VatPaymentReportListComponent', () => {
  let component: VatPaymentReportListComponent;
  let fixture: ComponentFixture<VatPaymentReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatPaymentReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatPaymentReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
