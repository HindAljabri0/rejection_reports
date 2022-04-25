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
    const request = new HttpRequest('GET', environment.NphiesConfigurationsService + requestUrl);
    return this.http.request(request);
  }

  uploadPriceList(providerId: string, body: any): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', body.file);
    formdata.append('payerNphiesId', body.payerNphiesId);
    formdata.append('effectiveDate', body.effectiveDate);

    const requestUrl = `/providers/${providerId}/pricelist/excel`;
    const request = new HttpRequest('POST', environment.NphiesConfigurationsService + requestUrl, formdata);
    return this.http.request(request);
  }

  getPriceList(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/pricelist/criteria?page=${body.page}&size=${body.size}`;
    delete body.page;
    delete body.size;
    const request = new HttpRequest('POST', environment.NphiesConfigurationsService + requestUrl, body);
    return this.http.request(request);
  }
//fetchAllPhysician
  getPhysicianList(providerId: string) {
    const requestURL = `/providers/${providerId}/physciains`;
    const request = new HttpRequest('GET', environment.NphiesConfigurationsService + requestURL);
    return this.http.request(request);
}

}
