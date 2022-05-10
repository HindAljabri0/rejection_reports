import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUploadsComponent } from './doctor-uploads.component';

describe('DoctorUploadsComponent', () => {
  let component: DoctorUploadsComponent;
  let fixture: ComponentFixture<DoctorUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
