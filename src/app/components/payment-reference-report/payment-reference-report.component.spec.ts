import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReferenceReportComponent } from './payment-reference-report.component';

describe('PaymentReferenceReportComponent', () => {
  let component: PaymentReferenceReportComponent;
  let fixture: ComponentFixture<PaymentReferenceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReferenceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReferenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
