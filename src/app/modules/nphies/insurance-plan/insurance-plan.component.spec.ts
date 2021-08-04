import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePlanComponent } from './insurance-plan.component';

describe('InsurancePlanComponent', () => {
  let component: InsurancePlanComponent;
  let fixture: ComponentFixture<InsurancePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
