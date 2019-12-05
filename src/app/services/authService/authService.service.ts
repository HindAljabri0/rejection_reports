import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    const requestURL = "/authenticate";
    const body:{} = {
      "username":username,
      "password":password
    };
    const request = new HttpRequest("POST", environment.authenticationHost + requestURL, body);
    return this.httpClient.request(request);
  }


  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('provider_id');
  }

  public get loggedIn(): boolean {
    const expiresIn = new Date(this.getExpiresIn());
    return localStorage.getItem('access_token') !== null && new Date().getTime() < expiresIn.getTime();
  }

  refreshCurrentToken(){
    const requestURL = "/authenticate/refresh";
    const body:{} = {
      "access_token":this.getAccessToken(),
      "refresh_token":this.getRefreshToken()
    };
    const request = new HttpRequest("POST", environment.authenticationHost + requestURL, body);
    return this.httpClient.request(request);
  }

  getCurrentUserToken(){
    const requestURL = "/authenticate/user/current";
    const request = new HttpRequest("GET", environment.authenticationHost + requestURL);
    return this.httpClient.request(request);
  }

  setTokens(body:{}){
    localStorage.setItem('access_token', body['access_token']);
    localStorage.setItem('refresh_token', body['refresh_token']);
    localStorage.setItem('expires_in', body['expires_in']);
    this.getCurrentUserToken().subscribe(event => {
      if(event instanceof HttpResponse){
        // console.log(event.body);
        let authority:string = event.body['authorities'][0]['authority'];
        localStorage.setItem('provider_id', authority.split('|')[0]);
      }
    });
  }

  getAccessToken(){
    return localStorage.getItem('access_token');
  }
  getRefreshToken(){
    return localStorage.getItem('refresh_token');
  }
  getExpiresIn(){
    return localStorage.getItem('expires_in');
  }
  getProviderId(){
    return localStorage.getItem('provider_id');
  }

}