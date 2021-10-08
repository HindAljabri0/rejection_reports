import { TestBed } from '@angular/core/testing';

import { NphiesClaimUploaderService } from './nphies-claim-uploader.service';

describe('NphiesClaimUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NphiesClaimUploaderService = TestBed.get(NphiesClaimUploaderService);
    expect(service).toBeTruthy();
  });
});
