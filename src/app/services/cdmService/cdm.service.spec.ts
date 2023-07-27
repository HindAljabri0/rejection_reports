import { TestBed } from '@angular/core/testing';

import { CdmService } from './cdm.service';

describe('CdmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CdmService = TestBed.get(CdmService);
    expect(service).toBeTruthy();
  });
});
