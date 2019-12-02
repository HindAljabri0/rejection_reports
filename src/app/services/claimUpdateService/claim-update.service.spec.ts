import { TestBed } from '@angular/core/testing';

import { ClaimUpdateService } from './claim-update.service';

describe('ClaimUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimUpdateService = TestBed.get(ClaimUpdateService);
    expect(service).toBeTruthy();
  });
});
