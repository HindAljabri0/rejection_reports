import { TestBed } from '@angular/core/testing';

import { ClaimTransactionService } from './claim-transaction.service';

describe('ClaimTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClaimTransactionService = TestBed.get(ClaimTransactionService);
    expect(service).toBeTruthy();
  });
});
