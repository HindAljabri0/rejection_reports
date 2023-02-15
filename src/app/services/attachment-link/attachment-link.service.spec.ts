import { TestBed } from '@angular/core/testing';

import { AttachmentLinkService } from './attachment-link.service';

describe('AttachmentLinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttachmentLinkService = TestBed.get(AttachmentLinkService);
    expect(service).toBeTruthy();
  });
});
