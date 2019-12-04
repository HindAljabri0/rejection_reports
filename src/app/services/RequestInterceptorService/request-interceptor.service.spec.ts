import { TestBed } from '@angular/core/testing';

import { RequestInterceptorService } from './request-interceptor.service';

describe('RequestInterceptorServicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestInterceptorService = TestBed.get(RequestInterceptorService);
    expect(service).toBeTruthy();
  });
});
