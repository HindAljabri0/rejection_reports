import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhysiciansDialogComponent } from './upload-physicians-dialog.component';

describe('UploadPhysiciansDialogComponent', () => {
  let component: UploadPhysiciansDialogComponent;
  let fixture: ComponentFixture<UploadPhysiciansDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPhysiciansDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhysiciansDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
