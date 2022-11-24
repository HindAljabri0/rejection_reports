import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GssReportResponse, VatInformation } from '../models/InitiateResponse.model';

@Injectable({
  providedIn: 'root'
})

export class TawuniyaGssService {

  gssReportResponse: GssReportResponse
  // vatInformation: VatInformation

  constructor(private http: HttpClient) {
  }

  generateReportInitiate(lossMonth: string) {
    let sub = new Subject<GssReportResponse>();
    let body = { "providerId": localStorage.getItem('provider_id'), "lossMonth": lossMonth, "username": localStorage.getItem('auth_username') }
    const requestUrl = "/gss/initiate/" + localStorage.getItem('provider_id');
    this.http.post<GssReportResponse>(environment.tawuniyaGssReport + requestUrl, body).subscribe(gssReportResponse => {
      sub.next(gssReportResponse)
      this.gssReportResponse = gssReportResponse
      // this.vatInformation = gssReportResponse.vatInformation
    }, error => {
      sub.error(error);
    })
    return sub
  }


  getGssReportResponse() {
    return this.gssReportResponse;
  }

  getVatInformation() {
    if(!this.gssReportResponse){
      return;
    }
    return this.gssReportResponse.vatInformation;
  }

  getVatInformationByGssRefNo(gssReferenceNumber: string) {
    let sub = new Subject<VatInformation>();
    const requestUrl = "/gss/vat-info/" + localStorage.getItem('provider_id') + '/' + gssReferenceNumber;
    this.http.get<VatInformation>(environment.tawuniyaGssReport + requestUrl).subscribe(vatInformation => {
      sub.next(vatInformation)
      // this.vatInformation = vatInformation
      if(this.gssReportResponse){
        this.gssReportResponse.vatInformation =  vatInformation
      }
    }, error => {
      sub.error(error);
    });

    return sub;
  }

  gssConfirmReport(confirmationRequest: any) {
    console.log('confirmationRequest: ', confirmationRequest);
    const requestUrl = "/gss/confirm/" + localStorage.getItem('provider_id');
    return this.http.post<any>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "gssReferenceNumber": gssReferenceNumber, "userName": localStorage.getItem('auth_username') });
  }

  submitVatInfoRequest(formData: FormData) {
    let sub = new Subject<VatInformation>();
    
    const requestUrl = "/gss/vat-info/" + localStorage.getItem('provider_id');
    this.http.post<VatInformation>(environment.tawuniyaGssReport + requestUrl, formData).subscribe(vatInformation => {
      sub.next(vatInformation)
      this.gssReportResponse.vatInformation = vatInformation
    }, error => {
      sub.error(error);
    });

    return sub;
  }

  gssQueryDetails(gssReferenceNumber: string) {
    let sub = new Subject<GssReportResponse>();
    const requestUrl = "/gss/details/" + localStorage.getItem('provider_id');
    this.http.post<GssReportResponse>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "gssReferenceNumber": gssReferenceNumber, "username": localStorage.getItem('auth_username') }).subscribe(gssReportResponse => {
      sub.next(gssReportResponse)
      this.gssReportResponse = gssReportResponse;
    }, error => {
      sub.error(error);
    });

    return sub;
    // return this.http.post<GssReportResponse>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "gssReferenceNumber": gssReferenceNumber, "username": localStorage.getItem('auth_username') });
  }

  gssQuerySummary(fromDate: string, toDate: string) {
    const requestUrl = "/gss/summary/" + localStorage.getItem('provider_id');
    return this.http.post<GssReportResponse[]>(environment.tawuniyaGssReport + requestUrl, { "providerId": localStorage.getItem('provider_id'), "fromDate": fromDate, "toDate": toDate, "username": localStorage.getItem('auth_username') });
  }

  downloadPDF(data: GssReportResponse) {
    const requestUrl = '/gss/download/' + localStorage.getItem('provider_id');
    const request = new HttpRequest('POST', environment.tawuniyaGssReport + requestUrl, data, { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

  getVatRate(lossMonth: string) {
    const requestUrl = '/gss/vat-rate';
    return this.http.get<{ vatRate: number }>(environment.tawuniyaGssReport + requestUrl, { params: { "loss-month": lossMonth } });
  }

  getVatNoByProviderId() {
    const requestUrl = '/gss/vat-no/';
    return this.http.get<{ vatNo: string}>(environment.tawuniyaGssReport + requestUrl, { params: { "provider-id": localStorage.getItem('provider_id') } });
  }

  resetModels() {
    this.gssReportResponse = null
    // this.vatInformation = null
  }

  isGssProcessable(lossMonth:string, status: string){
    let isNewOrRejected = status.toLowerCase() === 'new' || status.toLowerCase() === 'rejected';
    return isNewOrRejected && this.isLossMonthWithinPreviousTwoMonths(lossMonth);
  }

  isLossMonthWithinPreviousTwoMonths(lossMonth: string): boolean{
    let numberOfAllowedMonth = 2
		let currentMonth: number = new Date().getMonth() + 1;
		let currentYear = new Date().getFullYear();

		let date: string[] = lossMonth.split('-');
		let requestedMonth: number = +date[1];
		let requestedYear: number = +date[0];

		let monthCount: number = currentMonth - requestedMonth < 0 ? (currentMonth - requestedMonth + 12)
				: currentMonth - requestedMonth;
		let yearCount: number = currentMonth - requestedMonth < 0 ? currentYear - 1 : currentYear;
		return monthCount <= numberOfAllowedMonth && monthCount > 0 && requestedYear == yearCount;
  }


  // getVatInfoByGssRefNo(gssRefNo: string){
  //   const requestUrl = '/gss/vat-info';
  //   return this.http.get<any>(environment.tawuniyaGssReport + requestUrl, {params: {"gss-ref-no": gssRefNo}});
  // }
}