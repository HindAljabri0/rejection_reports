import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueComparativeReportCostClaimComponent } from './revenue-comparative-report-cost-claim.component';

describe('RevenueComparativeReportCostClaimComponent', () => {
  let component: RevenueComparativeReportCostClaimComponent;
  let fixture: ComponentFixture<RevenueComparativeReportCostClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueComparativeReportCostClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueComparativeReportCostClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
