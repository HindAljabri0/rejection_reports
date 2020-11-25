import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient) { }

  getProviderMappingsWithCategories(providerId:string){
    const requestUrl = `/providers/${providerId}/map-values?withCat=true`;
    const request = new HttpRequest('GET', environment.settingsServiceHost+requestUrl);
    return this.httpClient.request(request);
  }
}
