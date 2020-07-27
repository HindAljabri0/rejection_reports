import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDiagnosisComponent } from './claim-diagnosis.component';

describe('ClaimDiagnosisComponent', () => {
  let component: ClaimDiagnosisComponent;
  let fixture: ComponentFixture<ClaimDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
