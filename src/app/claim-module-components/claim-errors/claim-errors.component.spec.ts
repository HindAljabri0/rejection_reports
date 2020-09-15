import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimErrorsComponent } from './claim-errors.component';

describe('ClaimErrorsComponent', () => {
  let component: ClaimErrorsComponent;
  let fixture: ComponentFixture<ClaimErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
