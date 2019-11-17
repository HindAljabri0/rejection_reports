import { TestBed } from '@angular/core/testing';

import { SearchServiceService } from './search-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { environment } from 'src/environments/environment';
import { async } from 'q';

fdescribe('SearchServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [SearchServiceService]
  }));

  const service:SearchServiceService = TestBed.get(SearchServiceService);
  const httpMock = TestBed.get(HttpTestingController);

  it('should get summary data', () => {
    const httpRequest = service.getSummaries('104', '102', '2019-1-1', '2019-12-31', 'All').toPromise();
    expectAsync(httpRequest).toBeResolvedTo(jasmine.any(HttpResponse));

    // const requestURL:string = '/104/search/claim-summary?fromDate=2019-1-1&toDate=2019-12-31&payerId=102&status=All';
    // const req = httpMock.expectOne(environment.claimSearchHost+requestURL, 'call to api');
    // expect(req.request.method).toBe('GET');
  });
});
