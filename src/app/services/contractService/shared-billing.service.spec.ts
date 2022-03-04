import { TestBed } from '@angular/core/testing';

import { SharedBillingService } from './shared-billing.service';

describe('SharedBillingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedBillingService = TestBed.get(SharedBillingService);
    expect(service).toBeTruthy();
  });
});
