import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertPreAuthToClaimComponent } from './convert-pre-auth-to-claim.component';

describe('ConvertPreAuthToClaimComponent', () => {
  let component: ConvertPreAuthToClaimComponent;
  let fixture: ComponentFixture<ConvertPreAuthToClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertPreAuthToClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertPreAuthToClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
