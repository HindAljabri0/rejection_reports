import { TestBed } from '@angular/core/testing';

import { DbMappingService } from './db-mapping.service';

describe('DbMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbMappingService = TestBed.get(DbMappingService);
    expect(service).toBeTruthy();
  });
});
