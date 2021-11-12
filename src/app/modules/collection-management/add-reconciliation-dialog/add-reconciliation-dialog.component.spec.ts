import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReconciliationDialogComponent } from './add-reconciliation-dialog.component';

describe('AddReconciliationDialogComponent', () => {
  let component: AddReconciliationDialogComponent;
  let fixture: ComponentFixture<AddReconciliationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddReconciliationDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReconciliationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
