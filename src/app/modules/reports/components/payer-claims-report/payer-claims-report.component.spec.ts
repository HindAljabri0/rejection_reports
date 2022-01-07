import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerClaimsReportComponent } from './payer-claims-report.component';

describe('PayerClaimsReportComponent', () => {
  let component: PayerClaimsReportComponent;
  let fixture: ComponentFixture<PayerClaimsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerClaimsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerClaimsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
