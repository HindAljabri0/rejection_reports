import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVisionLensSpecificationsComponent } from './add-edit-vision-lens-specifications.component';

describe('AddEditVisionLensSpecificationsComponent', () => {
  let component: AddEditVisionLensSpecificationsComponent;
  let fixture: ComponentFixture<AddEditVisionLensSpecificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditVisionLensSpecificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVisionLensSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
