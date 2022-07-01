import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InitiateResponse } from '../models/InitiateResponse.model';

@Injectable({
  providedIn: 'root'
})

export class TawuniyaGssService {

  constructor(private http: HttpClient) { 
}

generateReportInitiate(lossMonth : string) {
  const requestUrl = "/gss/initiate/" + localStorage.getItem('provider_id');
  return this.http.post<InitiateResponse>(environment.tawuniyaGssReport + requestUrl, { "providerId" : localStorage.getItem('provider_id'), "lossMonth" : lossMonth , "userName" : localStorage.getItem('auth_username')});
}

}
