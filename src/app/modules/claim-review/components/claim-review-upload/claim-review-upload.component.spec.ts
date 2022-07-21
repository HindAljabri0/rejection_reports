import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimReviewUploadComponent } from './claim-review-upload.component';

describe('ClaimReviewUploadComponent', () => {
  let component: ClaimReviewUploadComponent;
  let fixture: ComponentFixture<ClaimReviewUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimReviewUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimReviewUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
