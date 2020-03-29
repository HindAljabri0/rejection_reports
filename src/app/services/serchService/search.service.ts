import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSummaries(providerId: string, statuses: string[], fromDate?: string, toDate?: string, payerId?: string, batchId?: string, uploadId?: string, casetype?: string) {
    let requestURL: string = `/providers/${providerId}/claims?`;
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += 'fromDate=' + fromDate
        + '&toDate=' + toDate + '&payerId=' + payerId + '&status=' + statuses.toString();
      if (casetype != null) requestURL += '&casetype='+casetype;
    }
    if (batchId != null) {
      requestURL += 'batchId=' + batchId + '&status=' + statuses.toString();
    }
    if(uploadId != null){
      requestURL += 'uploadId=' + uploadId + '&status=' + statuses.toString();
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getResults(providerId: string, fromDate?: string, toDate?: string, payerId?: string, statuses?: string[], page?: number, pageSize?: number, batchId?: string,  uploadId?: string, casetype?: string) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    let requestURL: string = `/providers/${providerId}/claims/details?`;
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += 'fromDate=' + fromDate
        + '&toDate=' + toDate + '&payerId=' + payerId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
      if (casetype != null) requestURL +=  '&casetype='+casetype;
    }
    if (batchId != null) {
      requestURL += 'batchId=' + batchId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if(uploadId != null){
      requestURL += 'uploadId=' + uploadId + '&status=' + statuses.toString()+ '&page=' + page + '&size=' + pageSize;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadSummaries(providerId: string, statuses: string[], fromDate?: string, toDate?: string, payerId?: string, batchId?: string, uploadId?: string) {
    let requestURL: string = `/providers/${providerId}/claims/download?status=${statuses.toString()}`;
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += `&fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}`;
    } else if(batchId != null) {
      requestURL += `&batchId=${batchId}`;
    } else if(uploadId != null){
      requestURL += `&uploadId=${uploadId}`;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "text" });
    return this.http.request(request);
  }

  getClaim(providerId: string, claimId: string) {
    const requestURL = `/providers/${providerId}/claims/${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
}
