import { TestBed } from '@angular/core/testing';

import { ProviderNphiesSearchService } from './provider-nphies-search.service';

describe('ProviderNphiesSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProviderNphiesSearchService = TestBed.get(ProviderNphiesSearchService);
    expect(service).toBeTruthy();
  });
});
