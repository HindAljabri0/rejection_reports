import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment } from '@angular/router';
import { Observable, TimeoutError } from 'rxjs';
import { AuthService } from '../authService/authService.service';
import { ClaimpageComponent } from 'src/app/pages/claimUploadignPage/claimpage.component';
import { SearchClaimsComponent } from 'src/app/pages/searchClaimsPage/search-claims.component';
import { NotificationsPageComponent } from 'src/app/pages/notifications-page/notifications-page.component';
import { Route } from '@angular/compiler/src/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RouteCanActiveService implements CanActivate, CanLoad {
  

  constructor(public authService:AuthService, public router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(!this.authService.loggedIn ){
      this.router.navigate(['/login']);
      return false;
    }
    let providerId;
    let payerId;
    let authority;
    switch(route.component){
      case ClaimpageComponent:
        return true;
      case SearchClaimsComponent:
        providerId = route.url[0].path;
        let batchId = route.queryParamMap.get("batchId");
        if(batchId != null && batchId != '') return true;
        let uploadId = route.queryParamMap.get('uploadId');
        console.log(uploadId);
        if(uploadId != null && uploadId != '') return true;
        payerId = route.queryParamMap.get("payer");
        authority = localStorage.getItem(providerId+payerId);
        if(providerId == null || providerId == "" || payerId == null || payerId == "" || authority == null){
          this.router.navigate(['/']);
          return false;
        }
        if(!authority.includes('3.0') && authority.includes('3.9') && authority.includes('3.91')){
          this.router.navigate(['/']);
          return false;
        }
        return true;
      case NotificationsPageComponent:
        return true;
      default:
        return true;
    }
  }

  canLoad(route:Route, segments:UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    if(!this.authService.loggedIn ){
      this.router.navigate(['/login']);
      return false;
    }
    return localStorage.getItem('101101').includes('|22') || localStorage.getItem('101101').startsWith('22');
  }

  
}
