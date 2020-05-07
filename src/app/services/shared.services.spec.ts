import { TestBed } from '@angular/core/testing';

import { SharedServices } from './shared.services';

describe('CommenServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedServices = TestBed.get(SharedServices);
    expect(service).toBeTruthy();
  });
});
