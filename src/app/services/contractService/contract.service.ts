import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contract } from 'src/app/models/contractModels/Contract';
import { ContractSearchModel } from 'src/app/models/contractModels/ContractSearchModel';
import { ContractTemplate } from 'src/app/models/contractModels/ContractTemplate';
import { environment } from 'src/environments/environment';
import { BillTemplate } from 'src/app/models/contractModels/BillingModels/BillTemplate';
import { InvoiceDetail } from 'src/app/models/contractModels/BillingModels/InvoiceDetail';

@Injectable({
    providedIn: 'root'
})
export class ContractService {

    constructor(private httpClient: HttpClient) { }
    getContractBySearchParam(reqParam: ContractSearchModel, providerId: string) {
        const requestUrl = `/contract/${providerId}/getAllContract`;
        let body: any = { ...reqParam };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }
    getContractById(reqParam: ContractSearchModel, providerId: string) {
        const requestUrl = `/contract/${providerId}/search`;
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
    ManipulateContract(contract: ContractTemplate, providerId: string) {
        const requestUrl = `/contract/${providerId}/manipulate`;
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

    deleteBill(deleteBill: BillTemplate) {
        const requestUrl = `/billing/deleteBill/`;
        let body: any = { ...deleteBill };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }


    updateBill(contract: BillTemplate) {
        const requestUrl = `/billing/updateBill`;
        let body: any = { ...contract };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }

    getBillList(providerId: string) {
        const requestUrl = `/billing/searchBill/${providerId}`;
        const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
        return this.httpClient.request(request);
    }

    getDoctorsByProviderId(providerId: string) {
        const requestUrl = `/billing/searchDoctor/${providerId}`;
        const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
        return this.httpClient.request(request);
    }

    getBillDetailsByBillId(billId: string) {
        const requestUrl = `/billing/billDetails/${billId}`;
        const request = new HttpRequest('GET', environment.contractManagementService + requestUrl);
        return this.httpClient.request(request);
    }

    createInvoice(invoice: InvoiceDetail, providerId: string) {
        const requestUrl = `/billing/payment/${providerId}/manipulate`;
        let body: any = { ...invoice };
        const httpRequest = new HttpRequest('POST', environment.contractManagementService + requestUrl, body);
        return this.httpClient.request(httpRequest);
    }

    // beneficiaryFullTextSearch( query: string) {
    //   const requestUrl = `/providers/${providerId}/beneficiaries?query=${query}`;
    //   const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    //   return this.http.request(request);
    // }
}
