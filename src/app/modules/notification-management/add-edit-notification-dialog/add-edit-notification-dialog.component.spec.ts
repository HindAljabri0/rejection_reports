import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNotificationDialogComponent } from './add-edit-notification-dialog.component';

describe('AddEditNotificationDialogComponent', () => {
  let component: AddEditNotificationDialogComponent;
  let fixture: ComponentFixture<AddEditNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditNotificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
