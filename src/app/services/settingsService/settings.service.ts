import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModifyingCodeValueRequest } from 'src/app/pages/configurationsPage/store/configurations.reducer';
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

  sendChangingProviderMappingsRequest(providerId:string, values:ModifyingCodeValueRequest[], type: 'SAVE' | 'DELETE'){
    if(type == 'SAVE'){
      return this.saveNewProviderMappings(providerId, values);
    } else {
      return this.deleteProviderMappings(providerId, values);
    }
  }

  saveNewProviderMappings(providerId:string, newValues:ModifyingCodeValueRequest[]){
    const requestUrl = `/providers/${providerId}/map-values`;
    const request = new HttpRequest('POST', environment.settingsServiceHost+requestUrl, newValues);
    return this.httpClient.request(request);
  }

  deleteProviderMappings(providerId:string, toDeleteValues:ModifyingCodeValueRequest[]){
    const requestUrl = `/providers/${providerId}/map-values`;
    const request = new HttpRequest('DELETE', environment.settingsServiceHost+requestUrl);
    const requestWithBody = request.clone({body: toDeleteValues});
    return this.httpClient.request(requestWithBody);
  }

}
