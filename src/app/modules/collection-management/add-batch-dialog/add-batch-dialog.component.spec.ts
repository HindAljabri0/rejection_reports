import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchDialogComponent } from './add-batch-dialog.component';

describe('AddBatchDialogComponent', () => {
  let component: AddBatchDialogComponent;
  let fixture: ComponentFixture<AddBatchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBatchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
