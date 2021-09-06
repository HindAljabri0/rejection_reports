import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAuthorizationDetailsComponent } from './pre-authorization-details.component';

describe('PreAuthorizationDetailsComponent', () => {
  let component: PreAuthorizationDetailsComponent;
  let fixture: ComponentFixture<PreAuthorizationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreAuthorizationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAuthorizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
