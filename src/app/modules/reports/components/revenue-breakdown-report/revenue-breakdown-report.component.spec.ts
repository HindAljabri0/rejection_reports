import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueBreakdownReportComponent } from './revenue-breakdown-report.component';

describe('RevenueBreakdownReportComponent', () => {
  let component: RevenueBreakdownReportComponent;
  let fixture: ComponentFixture<RevenueBreakdownReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueBreakdownReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueBreakdownReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
