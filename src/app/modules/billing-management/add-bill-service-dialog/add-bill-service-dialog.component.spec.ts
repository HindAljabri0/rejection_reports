import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillServiceDialogComponent } from './add-bill-service-dialog.component';

describe('AddBillServiceDialogComponent', () => {
  let component: AddBillServiceDialogComponent;
  let fixture: ComponentFixture<AddBillServiceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBillServiceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBillServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
