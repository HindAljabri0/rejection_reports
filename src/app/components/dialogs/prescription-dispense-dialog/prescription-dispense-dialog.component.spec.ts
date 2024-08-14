import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionDispenseDialogComponent } from './prescription-dispense-dialog.component';

describe('PrescriptionDispenseDialogComponent', () => {
  let component: PrescriptionDispenseDialogComponent;
  let fixture: ComponentFixture<PrescriptionDispenseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionDispenseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionDispenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
