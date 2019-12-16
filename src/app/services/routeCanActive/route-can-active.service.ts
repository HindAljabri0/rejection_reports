import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authService/authService.service';
import { ClaimpageComponent } from 'src/app/pages/claimUploadignPage/claimpage.component';
import { SearchClaimsComponent } from 'src/app/pages/searchClaimsPage/search-claims.component';
import { NotificationsPageComponent } from 'src/app/pages/notifications-page/notifications-page.component';


@Injectable({
  providedIn: 'root'
})
export class RouteCanActiveService implements CanActivate {

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
        payerId = route.queryParamMap.get("payer");
        authority = localStorage.getItem(providerId+payerId);
        if(providerId == null || providerId == "" || payerId == null || payerId == "" || authority == null){
          this.router.navigate(['/']);
          return false;
        }
        if(!authority.includes('3.0')){
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

  
}
