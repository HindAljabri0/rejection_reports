import { TestBed } from '@angular/core/testing';

import { NphiesConfigurationService } from './nphies-configuration.service';

describe('NphiesConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NphiesConfigurationService = TestBed.get(NphiesConfigurationService);
    expect(service).toBeTruthy();
  });
});
