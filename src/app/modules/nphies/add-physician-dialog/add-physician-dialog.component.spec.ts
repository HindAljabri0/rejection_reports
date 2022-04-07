import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhysicianDialogComponent } from './add-physician-dialog.component';

describe('AddPhysicianDialogComponent', () => {
  let component: AddPhysicianDialogComponent;
  let fixture: ComponentFixture<AddPhysicianDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhysicianDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhysicianDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
