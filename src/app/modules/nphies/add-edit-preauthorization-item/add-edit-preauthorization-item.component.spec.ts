import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPreauthorizationItemComponent } from './add-edit-preauthorization-item.component';

describe('AddEditPreauthorizationItemComponent', () => {
  let component: AddEditPreauthorizationItemComponent;
  let fixture: ComponentFixture<AddEditPreauthorizationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPreauthorizationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPreauthorizationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
