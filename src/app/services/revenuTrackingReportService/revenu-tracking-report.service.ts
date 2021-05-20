import { Injectable } from '@angular/core';
import { generateCleanClaimProgressReport } from 'src/app/models/generateCleanClaimProgressReport';
import { Observable } from 'rxjs';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RevenuTrackingReport } from 'src/app/models/revenuReportTrackingReport';

@Injectable({
  providedIn: 'root'
})
export class RevenuTrackingReportService {

  constructor(private http: HttpClient) { }
  generateCleanClaimProgressReport(providerId: string, data: RevenuTrackingReport): Observable<any> {
    const requestURL = `/providers/${providerId}/charts`;
    const request = new HttpRequest('POST', environment.uploaderHost + requestURL, data, { responseType: 'text' });
    return this.http.request(request);
  }
}
