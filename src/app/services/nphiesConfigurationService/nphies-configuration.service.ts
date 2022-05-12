import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { SinglePhysician } from 'src/app/models/nphies/SinglePhysicianModel';

@Injectable({
  providedIn: 'root'
})
export class NphiesConfigurationService {

  uploading = false;
  progress: { percentage: number } = { percentage: 0 };
  progressChange: Subject<{ percentage: number }> = new Subject();
  uploadingObs: Subject<boolean> = new Subject<boolean>();
  error: string;
  errorChange: Subject<string> = new Subject();
  summary: any;
  summaryChange: Subject<any> = new Subject<any>();
  HttpClient: any;


  constructor(private http: HttpClient) {
    this.http = http;
    this.progressChange.subscribe(value => {
      this.progress = value;
    });
    this.errorChange.subscribe(value => this.error = value);
  }

  downloadSample(providerId: string): Observable<any> {
    const requestUrl = `/providers/${providerId}/pricelist/download`;
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestUrl, { responseType: 'blob', reportProgress: true });
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

  getPhysicianList(providerId: string, page: number, size: number) {
    const requestURL = `/providers/${providerId}/physciains?page=${page}&size=${size}`;
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestURL);
    return this.http.request(request);
  }
  getPractitionerList(providerId: string) {
    const requestURL = '/providers/' + providerId + '/physciains?skipPagination=true';
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestURL);
    return this.http.request(request);
  }
  addSinglePhysician(providerId: string, PhysicianModel: SinglePhysician) {
    const requestUrl = `/providers/${providerId}/physciains`;
    let body: any = { ...PhysicianModel };
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }


  uploadPhysicianList(providerId: string, body: any): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', body.file);
    const requestUrl = `/providers/${providerId}/physciains/excel`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, formdata);
    return this.http.request(request);
  }

  downloadPhysicianList(providerId: string) {
    const requestUrl = `/providers/${providerId}/physciains/download`;
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestUrl, { responseType: 'blob', reportProgress: true });
    return this.http.request(request);
  }
}
