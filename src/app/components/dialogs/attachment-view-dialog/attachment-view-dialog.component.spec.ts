import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentViewDialogComponent } from './attachment-view-dialog.component';

describe('AttachmentViewDialogComponent', () => {
  let component: AttachmentViewDialogComponent;
  let fixture: ComponentFixture<AttachmentViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
