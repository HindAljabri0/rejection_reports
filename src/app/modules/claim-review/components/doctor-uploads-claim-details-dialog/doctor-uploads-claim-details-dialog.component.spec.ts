import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUploadsClaimDetailsDialogComponent } from './doctor-uploads-claim-details-dialog.component';

describe('DoctorUploadsClaimDetailsDialogComponent', () => {
  let component: DoctorUploadsClaimDetailsDialogComponent;
  let fixture: ComponentFixture<DoctorUploadsClaimDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorUploadsClaimDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorUploadsClaimDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
