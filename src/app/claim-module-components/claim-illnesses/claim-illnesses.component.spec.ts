import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimIllnessesComponent } from './claim-illnesses.component';

describe('ClaimIllnessesComponent', () => {
  let component: ClaimIllnessesComponent;
  let fixture: ComponentFixture<ClaimIllnessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimIllnessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimIllnessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
