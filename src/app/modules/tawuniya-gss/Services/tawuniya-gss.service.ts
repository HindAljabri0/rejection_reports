import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InitiateResponse } from '../models/InitiateResponse.model';

@Injectable({
  providedIn: 'root'
})

export class TawuniyaGssService {

  constructor(private http: HttpClient) {
  }

  generateReportInitiate(lossMonth: string) {
    const requestUrl = "/gss/initiate/" + localStorage.getItem('provider_id');
    return this.http.post<InitiateResponse>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "lossMonth": lossMonth, "userName": localStorage.getItem('auth_username') });
  }

  gssConfirmReport(gssReferenceNumber: string) {
    const requestUrl = "/gss/confirm/" + localStorage.getItem('provider_id');
    return this.http.post<any>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "gssReferenceNumber": gssReferenceNumber, "userName": localStorage.getItem('auth_username') });
  }

  gssQueryDetails(gssReferenceNumber: string) {
    const requestUrl = "/gss/details/" + localStorage.getItem('provider_id');
    return this.http.post<InitiateResponse>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "gssReferenceNumber": gssReferenceNumber, "userName": localStorage.getItem('auth_username') });
  }

  gssQuerySummary(fromDate: string, toDate: string) {
    const requestUrl = "/gss/summary/" + localStorage.getItem('provider_id');
    return this.http.post<InitiateResponse[]>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "fromDate": fromDate, "toDate": toDate, "userName": localStorage.getItem('auth_username') });
  }

  downloadPDF(gssReferenceNumber: string) {
    const requestUrl = '/gss/download/' + localStorage.getItem('provider_id');
    const request = new HttpRequest('POST', environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "gssReferenceNumber" : gssReferenceNumber, "userName": localStorage.getItem('auth_username') }, { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }
}