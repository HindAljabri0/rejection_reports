import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUploadsClaimListComponent } from './doctor-uploads-claim-list.component';

describe('DoctorUploadsClaimListComponent', () => {
  let component: DoctorUploadsClaimListComponent;
  let fixture: ComponentFixture<DoctorUploadsClaimListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorUploadsClaimListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorUploadsClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
