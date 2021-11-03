import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditItemDetailsModalComponent } from './add-edit-item-details-modal.component';

describe('AddEditItemDetailsModalComponent', () => {
  let component: AddEditItemDetailsModalComponent;
  let fixture: ComponentFixture<AddEditItemDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditItemDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditItemDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
