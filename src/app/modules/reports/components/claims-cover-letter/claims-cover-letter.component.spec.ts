import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsCoverLetterComponent } from './claims-cover-letter.component';

describe('ClaimsCoverLetterComponent', () => {
  let component: ClaimsCoverLetterComponent;
  let fixture: ComponentFixture<ClaimsCoverLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsCoverLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsCoverLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
