import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedClaimsComponent } from './submitted-claims.component';

describe('SubmittedClaimsComponent', () => {
  let component: SubmittedClaimsComponent;
  let fixture: ComponentFixture<SubmittedClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
