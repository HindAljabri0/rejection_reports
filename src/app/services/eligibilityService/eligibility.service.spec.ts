import { TestBed } from '@angular/core/testing';

import { EligibilityService } from './eligibility.service';

describe('EligibilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EligibilityService = TestBed.get(EligibilityService);
    expect(service).toBeTruthy();
  });
});
