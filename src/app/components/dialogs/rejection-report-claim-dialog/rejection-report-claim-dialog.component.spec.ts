import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionReportClaimDialogComponent } from './rejection-report-claim-dialog.component';

describe('RejectionReportClaimDialogComponent', () => {
  let component: RejectionReportClaimDialogComponent;
  let fixture: ComponentFixture<RejectionReportClaimDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionReportClaimDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionReportClaimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
