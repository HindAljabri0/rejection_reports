import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimPatientInfo } from './claim-patient-info.component';

describe('GenInfoLeftHeaderComponent', () => {
  let component: ClaimPatientInfo;
  let fixture: ComponentFixture<ClaimPatientInfo>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimPatientInfo ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimPatientInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
