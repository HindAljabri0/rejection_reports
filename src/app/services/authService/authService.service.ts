import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
// import { ApmService } from '@elastic/apm-rum-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  toKeepStorageValues: { key: string, value?: string }[] = [{ key: 'defaultDashboardPayer' }, { key: 'defaultDashboardSectionsOrder' }];

  isUserNameUpdated: Subject<boolean> = new Subject();
  onCancelPendingHttpRequests$: Subject<void> = new Subject();
  onCancelPendingHttpRequests = () => this.onCancelPendingHttpRequests$.asObservable();
  // amp;

  constructor(private httpClient: HttpClient, private router: Router) {
    // this.amp = apmService.init({
    //   serviceName: 'angular-app',
    //   serverUrl: 'https://apm-server-sample-elastic.apps.okd.waseel.com:443',
    //   secret_token: '76prrj79tw5kcpdwvkfshmfs',
    //   verify_server_cert:false
    // });
  }

  login(username: string, password: string) {
    const requestURL = '/authenticate';
    // this.amp.setUserContext({
    //   'username': username,
    //   'id': username
    // });
    const body: {} = {
      'username': username,
      'password': password
    };
    const request = new HttpRequest('POST', environment.authenticationHost + requestURL, body);
    return this.httpClient.request(request);
  }


  logout(expired?: boolean, hasClaimPrivileges?: boolean) {
    this.onCancelPendingHttpRequests$.next();
    let demoDoneValue;
    if (window.localStorage.getItem('onboarding-demo-done')) {
      demoDoneValue = window.localStorage.getItem('onboarding-demo-done');
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('provider_id');
    this.toKeepStorageValues.forEach((storageValue, i) => this.toKeepStorageValues[i].value = localStorage.getItem(storageValue.key));
    localStorage.clear();
    this.toKeepStorageValues.filter(storageValue =>
      storageValue.value != null).forEach((storageValue) =>
        localStorage.setItem(storageValue.key, storageValue.value));
    let promise: Promise<boolean>;
    if(expired != null && expired) {
      promise = this.router.navigate(['login'], { queryParams: { expired: expired } });
    } else  if(hasClaimPrivileges != null && hasClaimPrivileges){
      promise = this.router.navigate(['login'], { queryParams: { hasClaimPrivileges: hasClaimPrivileges } });
    } else {
      promise = this.router.navigate(['login']);
    }

    if (demoDoneValue) {
      window.localStorage.setItem('onboarding-demo-done', demoDoneValue);
    }

    promise.then(() => location.reload());
  }

  public get loggedIn(): boolean {
    const expiresIn = new Date(this.getExpiresIn());
    let isLogged: boolean;
    isLogged = localStorage.getItem('access_token') !== null && new Date().getTime() < expiresIn.getTime();
    const lastActivity = new Date(localStorage.getItem('lastActivity'));
    const diffTime = (Date.now() - lastActivity.getTime()) / (1000 * 60);
    if (!isLogged && localStorage.getItem('access_token') !== null) {
      this.logout(diffTime <= 60);
    }
    return isLogged;
  }


  refreshCurrentToken() {
    const requestURL = '/refresh';
    const body: {} = {
      'access_token': this.getAccessToken(),
      'refresh_token': this.getRefreshToken()
    };
    const request = new HttpRequest('POST', environment.authenticationHost + requestURL, body);
    return this.httpClient.request(request);
  }

  getCurrentUserToken() {
    const requestURL = '/users/current';
    const request = new HttpRequest('GET', environment.authenticationHost + requestURL);
    return this.httpClient.request(request);
  }

  setTokens(body: {}) {
    localStorage.setItem('access_token', body['access_token']);
    localStorage.setItem('refresh_token', body['refresh_token']);
    if (Date.now() < new Date(body['expires_in']).getTime()) {
      localStorage.setItem('expires_in', body['expires_in']);
    } else {
      localStorage.setItem('expires_in', new Date(Date.now() + (59 * 60 * 1000)).toString())
    }
    localStorage.setItem('src', body['src']);
    this.getCurrentUserToken().subscribe(event => {
      if (event instanceof HttpResponse) {
        const authorities: Array<any> = event.body['authorities'];
        const hasClaimPrivileges = authorities.some(element => element['authority'].split('|')[1].startsWith('3')
        || element['authority'].split('|')[1] == '22.0');
        if (hasClaimPrivileges) {
          event.body['authorities'].forEach(element => {
            const key = element['authority'].split('|')[0] + element['authority'].split('|')[2];
            const value = element['authority'].split('|')[1];
            const currentValue: string = localStorage.getItem(key);
            if (currentValue == null) {
              localStorage.setItem(key, value);
            } else {
              localStorage.setItem(key, currentValue + '|' + value);
            }
          });
          const authority: string = event.body['authorities'][0]['authority'];
          localStorage.setItem('provider_id', authority.split('|')[0]);
          localStorage.setItem('user_name', event.body['principal']['fullName']);
          localStorage.setItem('provider_name', event.body['principal']['providerName']);
          const payers = event.body['principal']['payers'];
          let payersStr = '';
          for (const payerid in payers) {
            payersStr += `${payerid}:${payers[payerid]}|`;
          }
          localStorage.setItem('payers', payersStr.substr(0, payersStr.length - 1));
          this.isUserNameUpdated.next(true);
        } else {
          this.logout(false, true);
        }
      }
    });
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  getExpiresIn() {
    return localStorage.getItem('expires_in');
  }
  getProviderId() {
    return localStorage.getItem('provider_id');
  }
  getUserName() {
    return localStorage.getItem('user_name');
  }
  getProviderName() {
    return localStorage.getItem('provider_name');
  }

}
