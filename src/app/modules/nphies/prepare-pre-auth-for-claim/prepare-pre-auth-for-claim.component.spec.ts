import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparePreAuthForClaim } from './prepare-pre-auth-for-claim.component';

describe('PreparePreAuthForClaim', () => {
  let component: PreparePreAuthForClaim;
  let fixture: ComponentFixture<PreparePreAuthForClaim>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreparePreAuthForClaim]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparePreAuthForClaim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
