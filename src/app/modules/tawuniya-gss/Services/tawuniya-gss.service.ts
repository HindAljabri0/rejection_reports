import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InitiateResponse } from '../models/InitiateResponse.model';

@Injectable({
  providedIn: 'root'
})

export class TawuniyaGssService {

  initiatedResponse: InitiateResponse

  constructor(private http: HttpClient) {
  }

  generateReportInitiate(lossMonth: string) {
    let sub = new Subject<InitiateResponse>();
    let body = { "providerId": localStorage.getItem('provider_id'), "lossMonth": lossMonth, "userName": localStorage.getItem('auth_username') }
    const requestUrl = "/gss/initiate/" + localStorage.getItem('provider_id');
    this.http.post<InitiateResponse>(environment.tawuniyaGssReport  + requestUrl , body).subscribe(initiateResponse => {
      sub.next(initiateResponse)
      this.initiatedResponse = initiateResponse
  }, error => {
      sub.error(error);
  })
  return sub
    // return this.http.post<InitiateResponse>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "lossMonth": lossMonth, "userName": localStorage.getItem('auth_username') });
  }


  getInitiatedResponse(){
    console.log('getInitiatedResponse only the method and init resp', this.initiatedResponse)
    return this.initiatedResponse;
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