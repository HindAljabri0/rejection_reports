import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsurancePlanDialogComponent } from './add-insurance-plan-dialog.component';

describe('AddInsurancePlanDialogComponent', () => {
  let component: AddInsurancePlanDialogComponent;
  let fixture: ComponentFixture<AddInsurancePlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsurancePlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsurancePlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
