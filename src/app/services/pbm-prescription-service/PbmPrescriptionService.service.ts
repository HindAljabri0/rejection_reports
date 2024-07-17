import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class PbmPrescriptionService {

    constructor(private http: HttpClient) { }

    sendPrescriberValidateRequest(providerId: string, body: any) {
        const requestUrl = `/providers/${providerId}/prescriber/validate`;
        const request = new HttpRequest('POST', environment.PbmPrescriptionValidate + requestUrl, body);
        return this.http.request(request);
    
        
    }
}