import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommenServicesService } from '../commen-services.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isUserNameUpdated: Subject<boolean> = new Subject();

  constructor(private httpClient: HttpClient, private router:Router) { }

  login(username: string, password: string) {
    const requestURL = "/authenticate";
    const body:{} = {
      "username":username,
      "password":password
    };
    const request = new HttpRequest("POST", environment.authenticationHost + requestURL, body);
    return this.httpClient.request(request);
  }


  logout(expired?:boolean) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('provider_id');
    localStorage.clear();
    if(expired == null || !expired)
      this.router.navigate(['login']);
    else
      this.router.navigate(['login'], {queryParams:{expired:expired}});
  }

  public get loggedIn(): boolean {
    const expiresIn = new Date(this.getExpiresIn());
    let isLogged: boolean;
    isLogged = localStorage.getItem('access_token') !== null && new Date().getTime() < expiresIn.getTime();
    if(!isLogged && localStorage.getItem('access_token') !== null) this.logout(true);
    return isLogged;
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
    localStorage.setItem('src', body['src']);
    this.getCurrentUserToken().subscribe(event => {
      if(event instanceof HttpResponse){
        event.body['authorities'].forEach(element => {
          const key = element['authority'].split('|')[0]+element['authority'].split('|')[2];
          const value = element['authority'].split('|')[1];
          let currentValue:string = localStorage.getItem(key);
          if(currentValue == null)
            localStorage.setItem(key, value);
          else
            localStorage.setItem(key, currentValue+'|'+value);
        });
        let authority:string = event.body['authorities'][0]['authority'];
        localStorage.setItem('provider_id', authority.split('|')[0]);
        localStorage.setItem('user_name', event.body['name']);
        localStorage.setItem('provider_name', event.body['principal']["providerName"]);
        this.isUserNameUpdated.next(true);
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
  getUserName(){
    return localStorage.getItem('user_name');
  }
  getProviderName(){
    return localStorage.getItem('provider_name');
  }

}