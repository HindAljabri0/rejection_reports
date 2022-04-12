import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesUploadSummaryDialogComponent } from './nphies-upload-summary-dialog.component';

describe('NphiesUploadSummaryDialogComponent', () => {
  let component: NphiesUploadSummaryDialogComponent;
  let fixture: ComponentFixture<NphiesUploadSummaryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesUploadSummaryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesUploadSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
