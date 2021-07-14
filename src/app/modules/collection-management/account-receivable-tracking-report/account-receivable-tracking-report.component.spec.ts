import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableTrackingReportComponent } from './account-receivable-tracking-report.component';

describe('AccountReceivableTrackingReportComponent', () => {
  let component: AccountReceivableTrackingReportComponent;
  let fixture: ComponentFixture<AccountReceivableTrackingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableTrackingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableTrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
