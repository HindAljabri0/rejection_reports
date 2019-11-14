import { TestBed } from '@angular/core/testing';

import { ClaimSubmittionService } from './claim-submittion.service';

describe('ClaimSubmittionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimSubmittionService = TestBed.get(ClaimSubmittionService);
    expect(service).toBeTruthy();
  });
});
