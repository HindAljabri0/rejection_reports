
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreditReportQueryModel } from 'src/app/models/creditReportQuery';
import { generateCleanClaimProgressReport } from 'src/app/models/generateCleanClaimProgressReport';
import { Observable } from 'rxjs';
import { ClaimStatusSummaryReport } from 'src/app/models/claimStatusSummaryReport';
import { StatementAccountSummary } from 'src/app/models/statementAccountModel';
import { PayerStatementModel } from 'src/app/models/payerStatmentModel';

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
    const requestURL = `/providers/${providerId}/payments/${paymentReference}`;
    // tslint:disable-next-line:max-line-length
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }


  downloadSubmittedInvoiceSummaryAsCSV(providerId: string, fromDate: string, toDate: string, payerId: string[]) {
    const requestURL = `/providers/${providerId}/submissions?` + `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}`;
    // tslint:disable-next-line:max-line-length
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

  downloadRejectionAsCSV(providerId: string, fromDate: string, toDate: string, payerId: string[], criteria: string) {
    let queryType: string;
    if (criteria == '1') {
      queryType = 'extraction';
    } else if (criteria == '2') {
      queryType = 'claim';
    }
    const requestURL = `/providers/${providerId}/rejections?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&queryType=${queryType}`;
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', {
      responseType: 'text',
      reportProgress: true
    });
    return this.http.request(request);
  }

  saveBupaRejectionReport(providerId: string, data: CreditReportQueryModel) {
    const body = { ...data };
    Object.keys(body).some(key => {
      if (body[key].toString().includes('%')) {
        body[key] = +body[key].replace(/%/g, '');
      }
      if (body[key] === '') {
        body[key] = 0;
      }
    });
    const requestURL = `/providers/${providerId}/report/rejected`;
    const request = new HttpRequest('POST', environment.creditReportService + requestURL, body, { responseType: 'text' });
    return this.http.request(request);
  }

  generateCleanClaimProgressReport(providerId: string, data: generateCleanClaimProgressReport): Observable<any> {
    const requestURL = `/providers/${providerId}/charts`;
    const request = new HttpRequest('POST', environment.uploaderHost + requestURL, data, { responseType: 'text' });
    return this.http.request(request);
  }
  getClaimStatusSummary(providerId: string, data: ClaimStatusSummaryReport): Observable<any> {
    const requestURL = `/providers/${providerId}/status-summary`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }

  downalodClaimStatusSummaryCsv(providerId: string, data: ClaimStatusSummaryReport): Observable<any> {
    const requestURL = `/providers/${providerId}/status-summary?payerId=${data.payerId}&fromDate=${data.fromDate}&toDate=${data.toDate}&summaryCriteria=${data.summaryCriteria}`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
      }
    }
    // { responseType: 'text', params: searchparams }
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '',
      { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }
  addPayerSOAData(providerId: any, fileUpload: File, data: any) {
    const formdata: FormData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'file') {
        formdata.append(key, data[key]);
      }
    }
    formdata.append('file', fileUpload);
    const requestURL = `/providers/${providerId}/statement`;

    const req = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
  getPayerSOAData(providerId: string, data: StatementAccountSummary): Observable<any> {
    const requestURL = `/providers/${providerId}/statement/fetch?` +
      `fromDate=${data.fromDate}&toDate=${data.toDate}&searchCriteria=${data.searchCriteria}&page=${data.page}&size=${data.size}`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }
  addPayementSOAData(providerId: any, data: any) {
    const requestURL = `/providers/${providerId}/payment/save`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }
  getPaymentStatmentSOA(providerId: string, data: PayerStatementModel): Observable<any> {
    const requestURL = `/providers/${providerId}/payment`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'totalPages') { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }
  getTechinicalRejection(providerId: string, fromDate: string, toDate: string, payerId: string[], queryType: string, page: number, pageSize: number): Observable<any> {
    const requestURL = `/providers/${providerId}/rejections/technical?payerId=${payerId}&fromDate=${fromDate}&toDate=${toDate}&queryType=${queryType}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }
  downloadTechnicalRejectionReport(providerId: string, fromDate: string, toDate: string, payerId: string[], queryType: string): Observable<any> {
    const requestURL = `/providers/${providerId}/rejections/technical?payerId=${payerId}&fromDate=${fromDate}&toDate=${toDate}&queryType=${queryType}`;
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '',
      { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }
  getMedicalRejection(providerId: string, fromDate: string, toDate: string, payerId: string[], queryType: string, page: number, pageSize: number): Observable<any> {
    const requestURL = `/providers/${providerId}/rejections/medical?payerId=${payerId}&fromDate=${fromDate}&toDate=${toDate}&queryType=${queryType}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }
  downloadMedicalRejectionReport(providerId: string, fromDate: string, toDate: string, payerId: string[], queryType: string): Observable<any> {
    const requestURL = `/providers/${providerId}/rejections/medical?payerId=${payerId}&fromDate=${fromDate}&toDate=${toDate}&queryType=${queryType}`;
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '',
      { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

  getAllDownloadsForProvider(providerId: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 5;
    }
    const requestURL = `/providers/${providerId}?page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL);
    return this.http.request(request);
  }

  getClaimCovers(model: any): Observable<any> {
    if (model.payerId) {
      var requestURL = `/providers/${model.providerId}/cover-letter?payerId=${model.payerId}&month=${model.month}`;
    } else {
      var requestURL = `/providers/${model.providerId}/cover-letter?tpaId=${model.tpaId}&month=${model.month}`;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadClaimCovers(model: any): Observable<any> {
    if (model.payerId) {
      var requestURL = `/providers/${model.providerId}/cover-letter?payerId=${model.payerId}&month=${model.month}`;
    } else {
      var requestURL = `/providers/${model.providerId}/cover-letter?tpaId=${model.tpaId}&month=${model.month}`;
    }
    const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

}
