import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionComparisonReportComponent } from './rejection-comparison-report.component';

describe('RejectionComparisonReportComponent', () => {
  let component: RejectionComparisonReportComponent;
  let fixture: ComponentFixture<RejectionComparisonReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionComparisonReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionComparisonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
