import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../authService/authService.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  isRefreshingToken = false;

  constructor(private authService: AuthService) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    localStorage.setItem('lastActivity', `${new Date()}`);
    if (!req.url.includes('authenticate') || req.url.includes('authenticate/user/current')) {
      const expiresIn: Date = new Date(this.authService.getExpiresIn());
      const currentTime: Date = new Date();
      const diffTime = (expiresIn.getTime() - currentTime.getTime()) / (1000 * 60);
      if (diffTime <= 30 && diffTime > 0 && !this.isRefreshingToken) {
        this.isRefreshingToken = true;
        this.authService.refreshCurrentToken().subscribe(event => {
          if (event instanceof HttpResponse) {
            this.authService.setTokens(event.body);
            this.isRefreshingToken = false;
          }
        });
      }
      return next.handle(this.addToken(req, this.authService.getAccessToken()))
        .pipe(takeUntil(this.authService.onCancelPendingHttpRequests()));
    }
    return next.handle(req).pipe(takeUntil(this.authService.onCancelPendingHttpRequests()));
  }

}
