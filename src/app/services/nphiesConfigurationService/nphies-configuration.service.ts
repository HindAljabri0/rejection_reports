import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NphiesConfigurationService {

  constructor(private http: HttpClient) { }

  downloadSample(providerId: string): Observable<any> {
    const requestUrl = `/providers/${providerId}/pricelist/download`;
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestUrl);
    return this.http.request(request);
  }

  uploadPriceList(providerId: string, body: any): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', body.file);
    formdata.append('payerNphiesId', body.payerNphiesId);
    formdata.append('effectiveDate', body.effectiveDate);

    const requestUrl = `/providers/${providerId}/pricelist/excel`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, formdata);
    return this.http.request(request);
  }

  getPriceList(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/pricelist/criteria?page=${body.page}&size=${body.size}`;
    delete body.page;
    delete body.size;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }


}
