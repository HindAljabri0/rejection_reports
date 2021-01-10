import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSummaries(providerId: string, statuses: string[], fromDate?: string, toDate?: string, payerId?: string, batchId?: string, uploadId?: string, casetype?: string, claimRefNo?: string, memberId?: string) {
    let requestURL: string = `/providers/${providerId}/claims?`;
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += 'fromDate=' + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate) + '&payerId=' + payerId + '&status=' + statuses.toString();
      if (casetype != null) requestURL += '&casetype=' + casetype;
    }
    if (batchId != null) {
      requestURL += 'batchId=' + batchId + '&status=' + statuses.toString();
    }
    if (uploadId != null) {
      requestURL += 'uploadId=' + uploadId + '&status=' + statuses.toString();
    }
    if (claimRefNo != null) {
      requestURL += `claimRefNo=${claimRefNo}` + '&status=' + statuses.toString();
    }
    if (memberId != null) {
      requestURL += `memberId=${memberId}` + '&status=' + statuses.toString();
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
  formatDate(toDate: string) {
    const format = 'yyyy-MM-dd';
    var locale = 'en-US';
    var formattedDate = formatDate(toDate, format, locale);
    return formattedDate.toString();
  }

  getResults(providerId: string, fromDate?: string, toDate?: string, payerId?: string, statuses?: string[], page?: number, pageSize?: number, batchId?: string, uploadId?: string, casetype?: string, claimRefNo?: string, memberId?: string) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    let requestURL: string = `/providers/${providerId}/claims/details?`;
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += 'fromDate=' + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate) + '&payerId=' + payerId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
      if (casetype != null) requestURL += '&casetype=' + casetype;
    }
    if (batchId != null) {
      requestURL += 'batchId=' + batchId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if (uploadId != null) {
      requestURL += 'uploadId=' + uploadId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if (claimRefNo != null) {
      requestURL += `claimRefNo=${claimRefNo}` + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if (memberId != null) {
      requestURL += `memberId=${memberId}` + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadSummaries(providerId: string, statuses: string[], fromDate?: string, toDate?: string, payerId?: string, batchId?: string, uploadId?: string, claimRefNo?: string, memberId?: string) {
    let requestURL: string = `/providers/${providerId}/claims/download?status=${statuses.toString()}`;
    if (fromDate != null && toDate != null && payerId != null) {
      requestURL += `&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}&payerId=${payerId}`;
    } else if (batchId != null) {
      requestURL += `&batchId=${batchId}`;
    } else if (uploadId != null) {
      requestURL += `&uploadId=${uploadId}`;
    } else if (claimRefNo != null) {
      requestURL += `claimRefNo=${claimRefNo}`;
    } else if (memberId != null) {
      requestURL += `memberId=${memberId}`;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "text" });
    return this.http.request(request);
  }

  getClaim(providerId: string, claimId: string) {
    const requestURL = `/providers/${providerId}/claims/${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getTopFiveRejections(rejectionBy: string, providerId: string, payerId: string, fromDate: string, toDate: string) {
    const requestURL = `/providers/${providerId}/top/${rejectionBy.toUpperCase()}?payerId=${payerId}&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
}
