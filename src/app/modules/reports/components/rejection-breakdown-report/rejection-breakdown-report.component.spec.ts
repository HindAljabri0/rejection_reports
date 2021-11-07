import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionBreakdownReportComponent } from './rejection-breakdown-report.component';

describe('RevenueBreakdownReportComponent', () => {
  let component: RejectionBreakdownReportComponent;
  let fixture: ComponentFixture<RejectionBreakdownReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionBreakdownReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionBreakdownReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
