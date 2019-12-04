import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class JwtService {

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
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
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

  setTokens(body:{}){
    localStorage.setItem('access_token', body['access_token']);
    localStorage.setItem('refresh_token', body['refresh_token']);
    localStorage.setItem('expires_in', body['expires_in']);
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

}