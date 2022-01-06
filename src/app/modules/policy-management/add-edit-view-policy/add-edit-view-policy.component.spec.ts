import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditViewPolicyComponent } from './add-edit-view-policy.component';

describe('AddEditViewPolicyComponent', () => {
  let component: AddEditViewPolicyComponent;
  let fixture: ComponentFixture<AddEditViewPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditViewPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditViewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
