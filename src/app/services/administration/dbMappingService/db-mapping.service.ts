import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbMappingService {

  constructor(private http:HttpClient) { }

  setDatabaseConfig(body) {
    const requestURL: string = `/providers/601/dbConfig`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  getDatabaseConfig() {
    const requestURL: string = `/providers/601/dbConfig`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
}
