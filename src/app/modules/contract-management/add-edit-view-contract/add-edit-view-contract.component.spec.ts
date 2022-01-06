import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditViewContractComponent } from './add-edit-view-contract.component';

describe('AddEditViewContractComponent', () => {
  let component: AddEditViewContractComponent;
  let fixture: ComponentFixture<AddEditViewContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditViewContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditViewContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
