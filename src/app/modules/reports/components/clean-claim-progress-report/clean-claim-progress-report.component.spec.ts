import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanClaimProgressReportComponent } from './clean-claim-progress-report.component';

describe('CleanClaimProgressReportComponent', () => {
  let component: CleanClaimProgressReportComponent;
  let fixture: ComponentFixture<CleanClaimProgressReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanClaimProgressReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanClaimProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
