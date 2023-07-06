import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPrescriptionItemComponent } from './add-edit-prescription-item.component';

describe('AddEditPrescriptionItemComponent', () => {
  let component: AddEditPrescriptionItemComponent;
  let fixture: ComponentFixture<AddEditPrescriptionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPrescriptionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPrescriptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
