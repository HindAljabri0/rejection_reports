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

  saveProviderPayerSettings(providerId:string, settings:{payerId:string, key:string, value:string}[]){
    const requestURL: string = `/providers/${providerId}/config`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, settings);
    return this.http.request(request);
  }

  getPortalUserSettings(providerId:string){
    const requestURL: string = `/providers/${providerId}/portal-user/username`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  savePortalUserSettings(providerId:string, username:string, password:string){
    const requestURL = `/providers/${providerId}/portal-user/save`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, {username: username, password:password});
    return this.http.request(request);
  }
  
}

export const SERVICE_CODE_VALIDATION_KEY = 'serviceCodeValidation';
export const SERVICE_CODE_RESTRICTION_KEY = 'serviceCodeRestriction';
