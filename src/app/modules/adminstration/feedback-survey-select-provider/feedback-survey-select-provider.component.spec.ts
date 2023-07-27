import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSurveySelectProviderComponent } from './feedback-survey-select-provider.component';

describe('FeedbackSurveySelectProviderComponent', () => {
  let component: FeedbackSurveySelectProviderComponent;
  let fixture: ComponentFixture<FeedbackSurveySelectProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackSurveySelectProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSurveySelectProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
