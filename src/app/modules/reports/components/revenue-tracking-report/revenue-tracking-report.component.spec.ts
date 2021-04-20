import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueTrackingReportComponent } from './revenue-tracking-report.component';

describe('RevenueTrackingReportComponent', () => {
  let component: RevenueTrackingReportComponent;
  let fixture: ComponentFixture<RevenueTrackingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueTrackingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueTrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
