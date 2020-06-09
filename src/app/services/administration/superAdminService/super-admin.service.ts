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

  getAssociatedPayers(providerId:string){
    const requestURL: string = `/providers/${providerId}/payers`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  getProviderPayerSettings(providerId:string, key:string){
    const requestURL: string = `/providers/${providerId}/config/${key}`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  getPortalUserSettings(providerId:string){
    const requestURL: string = `/providers/${providerId}/portal-user`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  
}

export const SERVICE_CODE_VALIDATION_KEY = 'serviceCodeValidation';