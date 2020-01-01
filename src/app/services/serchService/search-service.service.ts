import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {

  constructor(private http: HttpClient) { }

  getSummaries(providerId: string, status: string, fromDate?: string, toDate?: string, payerId?: string, batchId?: string) {
    let requestURL: string = '/' + providerId + '/search/claim-summary?';
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += 'fromDate=' + fromDate
        + '&toDate=' + toDate + '&payerId=' + payerId + '&status=' + status;
    }
    if (batchId != null) {
      requestURL +=  'batchId=' + batchId + '&status=' + status;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getResults(providerId: string, fromDate?: string, toDate?: string, payerId?: string, status?: string, page?: number, pageSize?: number, batchId?: string) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    let requestURL: string = '/' + providerId + '/search/claim-results?';
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += 'fromDate=' + fromDate
        + '&toDate=' + toDate + '&payerId=' + payerId + '&status=' + status + '&page=' + page + '&size=' + pageSize;
    }
    if (batchId != null) {
      requestURL += 'batchId=' + batchId + '&status=' + status + '&page=' + page + '&size=' + pageSize;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadSummaries(providerId: string, status: string, fromDate?: string, toDate?: string, payerId?: string, batchId?: string) {
    let requestURL: string = '/' + providerId + '/claim-download?status=' + status;
    if(fromDate != null && toDate != null && payerId != null){
      requestURL += `&fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}`;
    } else{
      requestURL += `&batchId=${batchId}`;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "text" });
    return this.http.request(request);
  }

  getClaim(providerId: string, claimId: string) {
    const requestURL = `/${providerId}/claims/${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
}
