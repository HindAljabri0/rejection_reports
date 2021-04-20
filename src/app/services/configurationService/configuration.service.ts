import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) { }

  uploadCSVFile(providerId: any, file: File): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('providerId', providerId);
    const req = new HttpRequest('POST', environment.settingsServiceHost + `/providers/${providerId}/map-values/csv`, formdata);
    return this.http.request(req);
  }

}
