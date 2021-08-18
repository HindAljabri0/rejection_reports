import { TestBed } from '@angular/core/testing';

import { ProvidersNphiesEligibilityService } from './providers-nphies-eligibility.service';

describe('ProvidersNphiesEligibilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvidersNphiesEligibilityService = TestBed.get(ProvidersNphiesEligibilityService);
    expect(service).toBeTruthy();
  });
});
