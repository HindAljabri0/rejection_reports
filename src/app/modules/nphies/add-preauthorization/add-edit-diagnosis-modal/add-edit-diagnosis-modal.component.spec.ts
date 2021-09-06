import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDiagnosisModalComponent } from './add-edit-diagnosis-modal.component';

describe('AddEditDiagnosisModalComponent', () => {
  let component: AddEditDiagnosisModalComponent;
  let fixture: ComponentFixture<AddEditDiagnosisModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDiagnosisModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDiagnosisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
