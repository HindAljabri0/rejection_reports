import { TestBed } from '@angular/core/testing';

import { TawuniyaGssService } from './tawuniya-gss.service';

describe('TawuniyaGssService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TawuniyaGssService = TestBed.get(TawuniyaGssService);
    expect(service).toBeTruthy();
  });
});
