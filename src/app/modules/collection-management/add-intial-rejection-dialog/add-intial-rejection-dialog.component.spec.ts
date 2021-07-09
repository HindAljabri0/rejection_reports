import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntialRejectionDialogComponent } from './add-intial-rejection-dialog.component';

describe('AddIntialRejectionDialogComponent', () => {
  let component: AddIntialRejectionDialogComponent;
  let fixture: ComponentFixture<AddIntialRejectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIntialRejectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntialRejectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
