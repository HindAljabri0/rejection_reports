import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubmissionsComponent } from './claim-submissions.component';

describe('ClaimSubmissionsComponent', () => {
  let component: ClaimSubmissionsComponent;
  let fixture: ComponentFixture<ClaimSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSubmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
