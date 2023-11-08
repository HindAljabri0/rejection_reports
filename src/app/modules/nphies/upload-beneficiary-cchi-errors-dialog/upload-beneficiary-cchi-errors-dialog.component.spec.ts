import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBeneficiaryCchiErrorsDialogComponent } from './upload-beneficiary-cchi-errors-dialog.component';

describe('UploadBeneficiaryCchiErrorsDialogComponent', () => {
  let component: UploadBeneficiaryCchiErrorsDialogComponent;
  let fixture: ComponentFixture<UploadBeneficiaryCchiErrorsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBeneficiaryCchiErrorsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBeneficiaryCchiErrorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
