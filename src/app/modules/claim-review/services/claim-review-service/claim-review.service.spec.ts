import { TestBed } from '@angular/core/testing';

import { ClaimReviewService } from './claim-review.service';

describe('ClaimReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimReviewService = TestBed.get(ClaimReviewService);
    expect(service).toBeTruthy();
  });
});
