import { TestBed } from '@angular/core/testing';

import { ClaimService } from './claim.service';

describe('ClaimUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimService = TestBed.get(ClaimService);
    expect(service).toBeTruthy();
  });
});
