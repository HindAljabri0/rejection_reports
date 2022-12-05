import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationAlertDialogComponent } from './confirmation-alert-dialog.component';

describe('ConfirmationAlertDialogComponent', () => {
  let component: ConfirmationAlertDialogComponent;
  let fixture: ComponentFixture<ConfirmationAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
