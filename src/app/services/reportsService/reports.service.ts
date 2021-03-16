
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreditReportQueryModel } from 'src/app/models/creditReportQuery';
import { generateCleanClaimProgressReport } from 'src/app/models/generateCleanClaimProgressReport';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getPaymentSummary(providerId: string, fromDate: string, toDate: string, payerId: string[], page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestURL = `/providers/${providerId}/payments?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getPaymentClaimSummary(providerId: string, paymentReference: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestURL = `/providers/${providerId}/payments/${paymentReference}?` +
      `page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getSubmittedInvoicesSummary(providerId: string, fromDate: string, toDate: string, payerId: string[], page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestURL = `/providers/${providerId}/submissions?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getSubmittedServicesOfClaim(providerId: string, payerId: string[], claimId: string) {
    const requestURL = `/providers/${providerId}/submissions/${claimId}?` +
      `payerId=${payerId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getPaymentClaimDetail(providerId: string, claimId: number) {
    const requestURL = `/providers/${providerId}/payments/${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getRejectionSummary(
    providerId: string,
    fromDate: string,
    toDate: string,
    payerId: string[],
    criteria: string,
    page?: number,
    pageSize?: number) {
    let queryType: string;
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    if (criteria == '1') {
      queryType = 'extraction';
    } else if (criteria == '2') {
      queryType = 'claim';
    }
    const requestURL = `/providers/${providerId}/rejections?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&queryType=${queryType}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getClaimRejection(providerId: string, payerId: string[], claimId: string) {
    const requestURL = `/providers/${providerId}/rejections/${claimId}?` +
      `payerId=${payerId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadPaymentClaimSummaryAsCSV(providerId: string, paymentReference: string) {
    const requestURL = `/providers/${providerId}/payments/${paymentReference}/download`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, '', { responseType: 'text' });
    return this.http.request(request);
  }


  downloadSubmittedInvoiceSummaryAsCSV(providerId: string, fromDate: string, toDate: string, payerId: string[]) {
    const requestURL = `/providers/${providerId}/submissions/download?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, '', { responseType: 'text' });
    return this.http.request(request);
  }

  downloadRejectionAsCSV(providerId: string, fromDate: string, toDate: string, payerId: string[], criteria: string) {
    let queryType: string;
    if (criteria == '1') {
      queryType = 'extraction';
    } else if (criteria == '2') {
      queryType = 'claim';
    }
    const requestURL = `/providers/${providerId}/rejections/download?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&queryType=${queryType}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, '', { responseType: 'text' });
    return this.http.request(request);
  }

  saveBupaRejectionReport(providerId: string, data: CreditReportQueryModel) {
    let body = { ...data };
    Object.keys(body).some(key => {
      if (body[key].toString().includes('%')) {
        body[key] = +body[key].replace(/%/g, "");
      }
      if (body[key] === "") {
        body[key] = 0;
      }
    });
    const requestURL = `/providers/${providerId}/report/rejected`;
    const request = new HttpRequest('POST', environment.claimSearchHost + requestURL, body, { responseType: 'text' });
    return this.http.request(request);
  }

  generateCleanClaimProgressReport(providerId: string, data: generateCleanClaimProgressReport): Observable<any> {
    const requestURL = `/providers/${providerId}/charts`;
    const request = new HttpRequest('POST', environment.uploaderHost + requestURL, data, { responseType: 'text' });
    return this.http.request(request);
  }
}
