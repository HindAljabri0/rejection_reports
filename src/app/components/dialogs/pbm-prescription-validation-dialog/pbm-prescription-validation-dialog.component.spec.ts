import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbmPrescriptionValidationDialogComponent } from './pbm-prescription-validation-dialog.component';

describe('PbmPrescriptionValidationDialogComponent', () => {
  let component: PbmPrescriptionValidationDialogComponent;
  let fixture: ComponentFixture<PbmPrescriptionValidationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbmPrescriptionValidationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbmPrescriptionValidationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
