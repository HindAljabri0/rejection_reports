import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSummaryDialogComponent } from './upload-summary-dialog.component';

describe('UploadSummaryDialogComponent', () => {
  let component: UploadSummaryDialogComponent;
  let fixture: ComponentFixture<UploadSummaryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSummaryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
