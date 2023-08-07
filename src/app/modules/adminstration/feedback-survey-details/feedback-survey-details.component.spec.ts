import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSurveyDetailsComponent } from './feedback-survey-details.component';

describe('FeedbackSurveyDetailsComponent', () => {
  let component: FeedbackSurveyDetailsComponent;
  let fixture: ComponentFixture<FeedbackSurveyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackSurveyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSurveyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
