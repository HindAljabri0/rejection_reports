import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronicPatientDetailsComponent } from './chronic-patient-details.component';

describe('ChronicPatientDetailsComponent', () => {
  let component: ChronicPatientDetailsComponent;
  let fixture: ComponentFixture<ChronicPatientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChronicPatientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronicPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
