import { TestBed } from '@angular/core/testing';

import { EclaimsTicketManagementService } from './eclaims-ticket-management.service';

describe('EclaimsTicketManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EclaimsTicketManagementService = TestBed.get(EclaimsTicketManagementService);
    expect(service).toBeTruthy();
  });
});
