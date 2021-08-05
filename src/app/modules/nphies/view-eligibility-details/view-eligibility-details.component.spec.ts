import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEligibilityDetailsComponent } from './view-eligibility-details.component';

describe('ViewEligibilityDetailsComponent', () => {
  let component: ViewEligibilityDetailsComponent;
  let fixture: ComponentFixture<ViewEligibilityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEligibilityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEligibilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
