import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableBreakdownReportComponent } from './account-receivable-breakdown-report.component';

describe('AccountReceivableBreakdownReportComponent', () => {
  let component: AccountReceivableBreakdownReportComponent;
  let fixture: ComponentFixture<AccountReceivableBreakdownReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableBreakdownReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableBreakdownReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
