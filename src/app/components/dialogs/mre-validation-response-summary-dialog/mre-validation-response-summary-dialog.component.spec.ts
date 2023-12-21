import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MreValidationResponseSummaryDialogComponent } from './mre-validation-response-summary-dialog.component';

describe('MreValidationResponseSummaryDialogComponent', () => {
  let component: MreValidationResponseSummaryDialogComponent;
  let fixture: ComponentFixture<MreValidationResponseSummaryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MreValidationResponseSummaryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MreValidationResponseSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
