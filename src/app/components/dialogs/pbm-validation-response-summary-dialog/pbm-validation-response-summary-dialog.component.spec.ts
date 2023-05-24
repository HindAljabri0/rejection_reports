import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbmValidationResponseSummaryDialogComponent } from './pbm-validation-response-summary-dialog.component';

describe('PbmValidationResponseSummaryDialogComponent', () => {
  let component: PbmValidationResponseSummaryDialogComponent;
  let fixture: ComponentFixture<PbmValidationResponseSummaryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbmValidationResponseSummaryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbmValidationResponseSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
