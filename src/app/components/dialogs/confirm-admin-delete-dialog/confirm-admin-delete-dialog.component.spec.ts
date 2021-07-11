import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAdminDeleteDialogComponent } from './confirm-admin-delete-dialog.component';

describe('ConfirmAdminDeleteDialogComponent', () => {
  let component: ConfirmAdminDeleteDialogComponent;
  let fixture: ComponentFixture<ConfirmAdminDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAdminDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAdminDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
