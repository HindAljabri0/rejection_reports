import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { classRequest } from 'src/app/models/contractModels/classModels/classRequest';
import { classCrudRequest } from 'src/app/models/contractModels/classModels/classCrudRequest';

@Injectable({
  providedIn: 'root'
})
export class ContractClassService {

  constructor(private httpClient: HttpClient) { }
  getClassBySearchParam(reqParam:classRequest) {
    const requestUrl = `/class/search`;
    let body: any = { ...reqParam};
    const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }
  ManipulateClass(cont_class:classCrudRequest) {
    const requestUrl = `/class/manipulate`;
    let body: any = { ...cont_class};
    const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }
  getContractDeparmentsByProviderId(providerId: string,contractId:number,classId:number) {
    const requestUrl = `/lookups/getContractDepartment/${providerId}/${contractId}/${classId}`;
    const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
    return this.httpClient.request(request);
  }
  getContractServicesByProviderId(providerId: string,contractId:number,classId:number) {
    const requestUrl = `/lookups/getContractService/${providerId}/${contractId}/${classId}`;
    const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
    return this.httpClient.request(request);
  }
  
}