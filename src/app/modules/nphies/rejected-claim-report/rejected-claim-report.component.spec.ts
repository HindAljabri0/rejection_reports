import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedClaimReportComponent } from './rejected-claim-report.component';

describe('RejectedClaimReportComponent', () => {
  let component: RejectedClaimReportComponent;
  let fixture: ComponentFixture<RejectedClaimReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedClaimReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedClaimReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
