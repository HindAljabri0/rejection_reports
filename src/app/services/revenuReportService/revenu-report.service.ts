import { Injectable } from '@angular/core';
import { generateCleanClaimProgressReport } from 'src/app/models/generateCleanClaimProgressReport';
import { Observable } from 'rxjs';
import { HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RevenuTrackingReport } from 'src/app/models/revenuReportTrackingReport';
import { RevenuComparativeReport } from 'src/app/models/revenuComparativeReport';
import { RejectionComparisonReport} from 'src/app/models/RejectionComparisonReport';

@Injectable({
  providedIn: 'root'
})
export class RevenuReportService {

  constructor(private http: HttpClient) { }
  generateRevenuTrackingReport(providerId: string, data: RevenuTrackingReport): Observable<any> {
    const requestURL = `/providers/${providerId}/revenue-tracking/${data.subcategory}`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'subcategory') {
          searchparams = searchparams.set(key, data[key]);
        }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }
  generateRevenuComparativeProgressReport(providerId: string, data: RevenuComparativeReport): Observable<any> {
    const requestURL = `/providers/${providerId}/revenue-comparative/payerId/${data.payerId}`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'payerId') { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }
  generateRevenuReportBreakdown(
    providerId: string, payerId: string, fromDate: string, toDate: string,
    category: 'Doctor' | 'Department' | 'ServiceCode' | 'ServiceType' | 'Payers'): Observable<any> {
    const requestURL = `/providers/${providerId}/reports/revenue-breakdown/payers/${payerId}?fromDate=${fromDate}&toDate=${toDate}&category=${category}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
  getServicePerDoctor(payerId: string, providerId: string, data: any) {
    const requestURL = `/providers/${providerId}/reports/revenue-breakdown/payers/${payerId}/doctor-service`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }
  generateRejectionTrackingReport(providerId: string, data: RevenuTrackingReport): Observable<any> {
    const requestURL = `/providers/${providerId}/rejection-tracking/${data.subcategory}`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'subcategory') {
          searchparams = searchparams.set(key, data[key]);
        }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }

  generateRejectionReportBreakdown(
    providerId: string, payerId: string, fromDate: string, toDate: string,
    category: 'Doctor' | 'Department' | 'ServiceCode' | 'ServiceType' | 'Payers'): Observable<any> {
    const requestURL = `/providers/${providerId}/reports/rejection-breakdown/payers/${payerId}?fromDate=${fromDate}&toDate=${toDate}&category=${category}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
  generateRejectionComparativeProgressReport(providerId: string, data: RejectionComparisonReport): Observable<any> {
    const requestURL = `/providers/${providerId}/payerId/${data.payerId}`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'payerId') { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }

  getServicesPerDoctor(payerId: string, providerId: string, data: any) {
    const requestURL = `/providers/${providerId}/reports/rejection-breakdown/payers/${payerId}/doctor-service`;

    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }

}
