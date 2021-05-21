/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RevenuTrackingReportService } from './revenu-tracking-report.service';

describe('Service: RevenuTrackingReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevenuTrackingReportService]
    });
  });

  it('should ...', inject([RevenuTrackingReportService], (service: RevenuTrackingReportService) => {
    expect(service).toBeTruthy();
  }));
});
