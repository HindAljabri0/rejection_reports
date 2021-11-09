import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditViewClassComponent } from './add-edit-view-class.component';

describe('AddEditViewClassComponent', () => {
  let component: AddEditViewClassComponent;
  let fixture: ComponentFixture<AddEditViewClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditViewClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditViewClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
