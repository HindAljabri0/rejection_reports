import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrescriptionDetailsDialogComponent } from './view-prescription-details-dialog.component';

describe('ViewPrescriptionDetailsDialogComponent', () => {
  let component: ViewPrescriptionDetailsDialogComponent;
  let fixture: ComponentFixture<ViewPrescriptionDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPrescriptionDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrescriptionDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
