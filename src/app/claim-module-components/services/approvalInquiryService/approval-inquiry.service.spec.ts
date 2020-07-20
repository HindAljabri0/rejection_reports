import { TestBed } from '@angular/core/testing';

import { ApprovalInquiryService } from './approval-inquiry.service';

describe('ApprovalInquiryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalInquiryService = TestBed.get(ApprovalInquiryService);
    expect(service).toBeTruthy();
  });
});
