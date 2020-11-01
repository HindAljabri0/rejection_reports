import { TestBed } from '@angular/core/testing';

import { ClaimFilesValidationService } from './claim-files-validation.service';

describe('ClaimFilesValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimFilesValidationService = TestBed.get(ClaimFilesValidationService);
    expect(service).toBeTruthy();
  });
});
