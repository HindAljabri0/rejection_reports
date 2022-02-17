import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { PolicySearchModel } from 'src/app/models/contractModels/PolicyModels/PolicySearchModel';
import { Policy } from 'src/app/models/contractModels/PolicyModels/Policy';

@Injectable({
    providedIn: 'root'
})
export class PolicyService {

    constructor(private httpClient: HttpClient) { }
    getPolicyBySearchParam(reqParam: PolicySearchModel, providerId: string) {
        const requestUrl = `/policy/${providerId}/search`;
        let body: any = { ...reqParam };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }
    ManipulatePolicy(policy: Policy, providerId: string) {
        const requestUrl = `/policy/${providerId}/manipulate`;
        let body: any = { ...policy };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }
}