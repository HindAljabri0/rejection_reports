import { Injectable } from '@angular/core';
import { generateCleanClaimProgressReport } from 'src/app/models/generateCleanClaimProgressReport';
import { Observable } from 'rxjs';
import { HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RevenuTrackingReport } from 'src/app/models/revenuReportTrackingReport';
import { RevenuComparativeReport } from 'src/app/models/revenuComparativeReport';

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
        if (data.hasOwnProperty(key) && data[key] !== undefined && key !== 'subcategory') { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, { responseType: 'text', params: searchparams });
    return this.http.request(request);
  }
  generateRevenuComparativeProgressReport(providerId: string, data: RevenuComparativeReport): Observable<any> {
    const requestURL = `/providers/${providerId}/charts`;
    const request = new HttpRequest('POST', environment.uploaderHost + requestURL, data, { responseType: 'text' });
    return this.http.request(request);
  }
}
