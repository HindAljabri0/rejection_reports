import { TestBed } from '@angular/core/testing';

import { NphiesPollManagementService } from './nphies-poll-management.service';

describe('NphiesPollManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NphiesPollManagementService = TestBed.get(NphiesPollManagementService);
    expect(service).toBeTruthy();
  });
});
