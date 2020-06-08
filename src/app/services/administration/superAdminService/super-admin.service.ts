import { Injectable } from '@angular/core';
import { AdminstrationModule } from 'src/app/modules/adminstration/adminstration.module';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  constructor(private http:HttpClient) { }

  getProviders() {
    const requestURL: string = '/providers';
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }
}
