import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDignosisComponent } from './claim-dignosis.component';

describe('ClaimDignosisComponent', () => {
  let component: ClaimDignosisComponent;
  let fixture: ComponentFixture<ClaimDignosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDignosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDignosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
