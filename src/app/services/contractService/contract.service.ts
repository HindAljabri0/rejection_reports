import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contract } from 'src/app/models/contractModels/Contract';
import { ContractSearchModel } from 'src/app/models/contractModels/ContractSearchModel';
import { ContractTemplate } from 'src/app/models/contractModels/ContractTemplate';
import { environment } from 'src/environments/environment';
import { BillTemplate } from 'src/app/models/contractModels/BillingModels/BillTemplate';

@Injectable({
    providedIn: 'root'
})
export class ContractService {

    constructor(private httpClient: HttpClient) { }
    getContractBySearchParam(reqParam: ContractSearchModel) {
        const requestUrl = `/contract/getAllContract`;
        let body: any = { ...reqParam };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }
    getContractById(reqParam: ContractSearchModel) {
        const requestUrl = `/contract/search`;
        let body: any = { ...reqParam };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }
    getDeparmentsByProviderId(providerId: string) {
        const requestUrl = `/lookups/getDepartment/${providerId}`;
        const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
        return this.httpClient.request(request);
    }
    getServiceByProviderId(providerId: string) {
        const requestUrl = `/lookups/getService/${providerId}`;
        const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
        return this.httpClient.request(request);
    }
    ManipulateContract(contract: ContractTemplate) {
        const requestUrl = `/contract/manipulate`;
        let body: any = { ...contract };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }

    servicesListSearch(providerId: string, data: any) {
        const requestUrl = `/billing/searchServiceList/${providerId}`;
        let body: any = { ...data };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }

    createBill(contract: BillTemplate) {
        const requestUrl = `/billing/createBill`;
        let body: any = { ...contract };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }

    // beneficiaryFullTextSearch( query: string) {
    //   const requestUrl = `/providers/${providerId}/beneficiaries?query=${query}`;
    //   const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    //   return this.http.request(request);
    // }
}
