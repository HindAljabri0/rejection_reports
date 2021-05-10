import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueComparativeReportComponent } from './revenue-comparative-report.component';

describe('RevenueComparativeReportComponent', () => {
  let component: RevenueComparativeReportComponent;
  let fixture: ComponentFixture<RevenueComparativeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueComparativeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueComparativeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
