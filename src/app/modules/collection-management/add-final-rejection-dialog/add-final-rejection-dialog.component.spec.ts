import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinalRejectionDialogComponent } from './add-final-rejection-dialog.component';

describe('AddFinalRejectionDialogComponent', () => {
  let component: AddFinalRejectionDialogComponent;
  let fixture: ComponentFixture<AddFinalRejectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFinalRejectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFinalRejectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
