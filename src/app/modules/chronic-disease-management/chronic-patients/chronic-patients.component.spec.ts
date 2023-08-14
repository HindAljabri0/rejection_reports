import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronicPatientsComponent } from './chronic-patients.component';

describe('ChronicPatientsComponent', () => {
  let component: ChronicPatientsComponent;
  let fixture: ComponentFixture<ChronicPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChronicPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronicPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
