import { TestBed } from '@angular/core/testing';

import { GlobMedService } from './glob-med.service';

describe('GlobMedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobMedService = TestBed.get(GlobMedService);
    expect(service).toBeTruthy();
  });
});
