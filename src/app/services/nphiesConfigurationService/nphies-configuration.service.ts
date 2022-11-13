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
  downloadSampleDaysOfSupply(providerId: string): Observable<any> {
    const requestUrl = `/providers/${providerId}/daysofsupply/download`;
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestUrl, { responseType: 'blob', reportProgress: true });
    return this.http.request(request);
  }
  uploadPriceList(providerId: string, body: any): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', body.file);
    formdata.append('payerNphiesId', body.insurancePlanPayerId.split(':')[1]);
    formdata.append('effectiveDate', body.effectiveDate);
    formdata.append('tpaNphiesId', body.tpaNphiesId);

    const requestUrl = `/providers/${providerId}/pricelist/excel`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, formdata);
    return this.http.request(request);
  }

  uploadMedicationDays(providerId: string, body: any): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', body.file);

    const requestUrl = `/providers/${providerId}/daysofsupply/excel`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, formdata);
    return this.http.request(request);
  }
  deleteMedicationRecord(providerId: string, itemId: number) {
    const requestUrl = `/providers/${providerId}/daysofsupply/${itemId}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('DELETE', environment.nphiesConfigurationService + requestUrl, {}, { headers });
    return this.http.request(request);
  }
  getPriceList(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/pricelist/criteria?page=${body.page}&size=${body.size}`;
    delete body.page;
    delete body.size;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }

  getPhysicianList(
    providerId: string, page: number, size: number, physicianId: string,
    physicianName: string, specialityCode: string, physicianRole: string) {
    let requestURL = `/providers/${providerId}/physciains?page=${page}&size=${size}`;

    if (physicianId) {
      requestURL += `&physician_id=${physicianId}`;
    }

    if (physicianName) {
      requestURL += `&physician_name=${physicianName}`;
    }

    if (specialityCode) {
      requestURL += `&speciality_code=${specialityCode}`;
    }

    if (physicianRole) {
      requestURL += `&physician_role=${physicianRole}`;
    }

    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestURL);
    return this.http.request(request);
  }
  getMedicationList(searchText:string ,providerId: string, page: number, size: number) {
    let requestURL = `/providers/${providerId}/daysofsupply?query=${searchText}&page=${page}&size=${size}`;

    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestURL);
    return this.http.request(request);
  }
  addUpdateSingleMedicationSupply(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/daysofsupply`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }
  searchPractitioner(providerId: string, searchQuery: string) {
    const requestURL: string = `/providers/${providerId}/physciains/search?query=` + searchQuery;
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestURL);
    return this.http.request(request);
  }

  getPractitionerList(providerId: string) {
    const requestURL = '/providers/' + providerId + '/physciains?skipPagination=true';
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestURL);
    return this.http.request(request);
  }

  addUpdateSinglePhysician(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/physciains`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }
  
  deletePhysician(providerId: string, physicianId: string) {
    const requestUrl = `/providers/${providerId}/physciains/${physicianId}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('DELETE', environment.nphiesConfigurationService + requestUrl, {}, { headers });
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
    // tslint:disable-next-line:max-line-length
    const request = new HttpRequest('GET', environment.nphiesConfigurationService + requestUrl, { responseType: 'blob', reportProgress: true });
    return this.http.request(request);
  }

  addPriceDetail(providerId: string, priceListId: number, body: any) {
    const requestUrl = `/providers/${providerId}/pricelist/service/add?priceListId=${priceListId}`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }

  updatePriceDetail(providerId: string, priceListId: number, body: any) {
    const requestUrl = `/providers/${providerId}/pricelist/service/update?priceListId=${priceListId}`;
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }

  deletePriceDetail(providerId: string, priceListId: string, body: any) {
    const requestUrl = `/providers/${providerId}/pricelist/service/delete?priceListId=${priceListId}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.nphiesConfigurationService + requestUrl, body);
    return this.http.request(request);
  }

  deletePriceList(providerId: string, priceListId: string) {
    const requestUrl = `/providers/${providerId}/pricelist/${priceListId}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('DELETE', environment.nphiesConfigurationService + requestUrl);
    return this.http.request(request);
  }
}
