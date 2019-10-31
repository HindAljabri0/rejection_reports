import { TestBed } from '@angular/core/testing';

import { CommenServicesService } from './commen-services.service';

describe('CommenServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommenServicesService = TestBed.get(CommenServicesService);
    expect(service).toBeTruthy();
  });
});
