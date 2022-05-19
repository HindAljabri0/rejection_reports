import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiagnosisComponent } from './manage-diagnosis.component';

describe('ManageDiagnosisComponent', () => {
  let component: ManageDiagnosisComponent;
  let fixture: ComponentFixture<ManageDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
