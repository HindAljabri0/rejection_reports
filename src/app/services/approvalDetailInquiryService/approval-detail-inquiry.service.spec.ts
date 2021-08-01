import { TestBed } from '@angular/core/testing';

import { ApprovalDetailInquiryService } from './approval-detail-inquiry.service';

describe('ApprovalDetailInquiryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalDetailInquiryService = TestBed.get(ApprovalDetailInquiryService);
    expect(service).toBeTruthy();
  });
});
