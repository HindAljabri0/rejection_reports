import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedClaimProgressReportComponent } from './rejected-claim-progress-report.component';

describe('RejectedClaimProgressReportComponent', () => {
  let component: RejectedClaimProgressReportComponent;
  let fixture: ComponentFixture<RejectedClaimProgressReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedClaimProgressReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedClaimProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
