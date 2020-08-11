import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonSubmittedClaimsComponent } from './non-submitted-claims.component';

describe('NonSubmittedClaimsComponent', () => {
  let component: NonSubmittedClaimsComponent;
  let fixture: ComponentFixture<NonSubmittedClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonSubmittedClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonSubmittedClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
