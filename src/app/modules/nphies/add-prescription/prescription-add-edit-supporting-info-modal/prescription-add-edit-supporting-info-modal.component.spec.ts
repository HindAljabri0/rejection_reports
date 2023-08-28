import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSupportingInfoModalComponent } from './add-edit-supporting-info-modal.component';

describe('AddEditSupportingInfoModalComponent', () => {
  let component: AddEditSupportingInfoModalComponent;
  let fixture: ComponentFixture<AddEditSupportingInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSupportingInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSupportingInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
