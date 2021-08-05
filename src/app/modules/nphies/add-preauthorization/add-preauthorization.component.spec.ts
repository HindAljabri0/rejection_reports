import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreauthorizationComponent } from './add-preauthorization.component';

describe('AddPreauthorizationComponent', () => {
  let component: AddPreauthorizationComponent;
  let fixture: ComponentFixture<AddPreauthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPreauthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreauthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
