import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainClaimPageComponent } from './main-claim-page.component';

describe('MainClaimPageComponent', () => {
  let component: MainClaimPageComponent;
  let fixture: ComponentFixture<MainClaimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainClaimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainClaimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
