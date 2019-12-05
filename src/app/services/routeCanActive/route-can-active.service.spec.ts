import { TestBed } from '@angular/core/testing';

import { RouteCanActiveService } from './route-can-active.service';

describe('RouteCanActiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteCanActiveService = TestBed.get(RouteCanActiveService);
    expect(service).toBeTruthy();
  });
});
