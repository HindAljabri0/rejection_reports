import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimSubmittionService {

  constructor(private http: HttpClient) { }


  submitClaims(claims: string[], providerId: string, payerId: string) {
    let requestURL: string = `/providers/${providerId}/submit?payerID=${payerId}`;
    const request = new HttpRequest('POST', environment.claimServiceHost + requestURL, { claimIds: claims }, {});
    return this.http.request(request);
  }

  submitAllClaims(providerId: string, fromDate: string, toDate: string, payerId: string, uploadId: String) {
    let requestURL: string;
    if (uploadId != null) {
      requestURL = `/providers/${providerId}/submit/criteria?uploadID=${uploadId}`;
    } else {
      requestURL = `/providers/${providerId}/submit/criteria?payerID=${payerId}&fromDate=` + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate);
    }
    

    const request = new HttpRequest('POST', environment.claimServiceHost + requestURL, {});
    return this.http.request(request);
  }

  formatDate(date: string) {
    const splittedDate = date.split('-');
    if(splittedDate[2].length == 4){
      const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      return formattedDate;
    } else return date;
  }
}
