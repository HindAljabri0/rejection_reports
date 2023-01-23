import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAttachmentUploadDialogComponent } from './choose-attachment-upload-dialog.component';

describe('ChooseAttachmentUploadDialogComponent', () => {
  let component: ChooseAttachmentUploadDialogComponent;
  let fixture: ComponentFixture<ChooseAttachmentUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseAttachmentUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAttachmentUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
