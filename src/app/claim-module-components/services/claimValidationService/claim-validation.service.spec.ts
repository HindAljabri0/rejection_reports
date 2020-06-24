import { TestBed } from '@angular/core/testing';

import { ClaimValidationService } from './claim-validation.service';

describe('ClaimValidationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimValidationService = TestBed.get(ClaimValidationService);
    expect(service).toBeTruthy();
  });
});
