import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authService/authService.service';
import { ClaimpageComponent } from 'src/app/pages/claimUploadignPage/claimpage.component';
import { SearchClaimsComponent } from 'src/app/pages/searchClaimsPage/search-claims.component';
import { NotificationsPageComponent } from 'src/app/pages/notifications-page/notifications-page.component';
import { Route } from '@angular/compiler/src/core';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';


@Injectable({
  providedIn: 'root'
})
export class RouteCanActiveService implements CanActivate, CanLoad {


  constructor(public authService: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.authService.loggedIn) {
      return this.router.createUrlTree(['/login']);
    }
    let providerId;
    let payerId;
    let authority;
    switch (route.component) {
      case ClaimpageComponent:
        return true;
      case DashboardComponent:
        if (this._isAdmin()) {
          return this.router.createUrlTree(['administration'])
        } else {
          return true;
        }
      case SearchClaimsComponent:
        providerId = route.url[0].path;
        let batchId = route.queryParamMap.get("batchId");
        if (batchId != null && batchId != '') return true;
        let uploadId = route.queryParamMap.get('uploadId');
        if (uploadId != null && uploadId != '') return true;
        let claimRefNo = route.queryParamMap.get('claimRefNo');
        if (claimRefNo != null && claimRefNo != '') return true;
        let memberId = route.queryParamMap.get('memberId');
        if (memberId != null && memberId != '') return true;
        payerId = route.queryParamMap.get("payer");
        authority = localStorage.getItem(providerId + payerId);
        if (providerId == null || providerId == "" || payerId == null || payerId == "" || authority == null) {
          return this.router.createUrlTree(['/']);
        }
        if (!authority.includes('3.0') && authority.includes('3.9') && authority.includes('3.91')) {
          return this.router.createUrlTree(['/']);
        }
        return true;
      case NotificationsPageComponent:
        return true;
      default:
        return true;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.authService.loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    if (segments[0].path == 'administration') {
      return this._isAdmin();
    } else if (segments[0].path == 'claims') {
      return true;
    } else if (segments[0].path == 'configurations') {
      try {
        const providerId = localStorage.getItem('provider_id');
        const userPrivileges = localStorage.getItem(`${providerId}101`);
        return userPrivileges.split('|').includes('3.0');
      } catch(error){
        console.log(error);
        return false;
      }
    }

  }

  private _isAdmin(): boolean {
    let item = localStorage.getItem('101101');
    return item != null && (item.includes('|22') || item.startsWith('22'));
  }

}
