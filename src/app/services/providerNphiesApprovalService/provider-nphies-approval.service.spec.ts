import { TestBed } from '@angular/core/testing';

import { ProviderNphiesApprovalService } from './provider-nphies-approval.service';

describe('ProviderNphiesApprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProviderNphiesApprovalService = TestBed.get(ProviderNphiesApprovalService);
    expect(service).toBeTruthy();
  });
});
