import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authService/authService.service';
import { ClaimpageComponent } from 'src/app/pages/claimUploadignPage/claimpage.component';
import { SearchClaimsComponent } from 'src/app/pages/searchClaimsPage/search-claims.component';
import { NotificationsPageComponent } from 'src/app/pages/notifications-page/notifications-page.component';
import { Route } from '@angular/compiler/src/core';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { NphiesSearchClaimsComponent } from 'src/app/modules/nphies/nphies-search-claims/nphies-search-claims.component';
import { getUserPrivileges, initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { log } from 'util';
import { Store } from '@ngrx/store';
import { SharedServices } from '../shared.services';


@Injectable({
  providedIn: 'root'
})
export class RouteCanActiveService implements CanActivate, CanLoad {


  constructor(public authService: AuthService, public router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {


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
        if (this._isOnlyPayerUser()) {
          return this.router.navigate(['/reports/payer-claims-report']);
        }
        if (this._isOnlyAdmin()) {
          return this.router.createUrlTree(['administration/switch-provider']);
          
        } else if (this._isOnlyRcm()) {
          if (this._isDoctorOrCoder()) {
            return this.router.createUrlTree(['review', 'scrubbing', 'upload']);
          }
          return this.router.createUrlTree(['administration', 'switch-provider']);
        } else {
          return true;
        }

      case SearchClaimsComponent || NphiesSearchClaimsComponent:
        providerId = route.url[0].path;
        const batchId = route.queryParamMap.get('batchId');
        if (batchId != null && batchId != '') {
          return true;
        }
        const uploadId = route.queryParamMap.get('uploadId');
        if (uploadId != null && uploadId != '') {
          return true;
        }
        const claimRefNo = route.queryParamMap.get('claimRefNo');
        if (claimRefNo != null && claimRefNo != '') {
          return true;
        }
        const memberId = route.queryParamMap.get('memberId');
        if (memberId != null && memberId != '') {
          return true;
        }
        const invoiceNo = route.queryParamMap.get('invoiceNo');
        if (invoiceNo != null && invoiceNo != '') {
          return true;
        }
        const patientFileNo = route.queryParamMap.get('patientFileNo');
        if (patientFileNo != null && patientFileNo != '') {
          return true;
        }
        const policyNo = route.queryParamMap.get('policyNo');
        if (policyNo != null && policyNo != '') {
          return true;
        }
        const nationalId = route.queryParamMap.get('nationalId');
        if (nationalId != null && nationalId != '') {
          return true;
        }
        payerId = route.queryParamMap.get('payerId');
        let organizationId = route.queryParamMap.get('organizationId');
        if ((payerId == null || payerId == '') && organizationId != null && organizationId != '') {
          const payersStr = localStorage.getItem('payers');
          if (!payersStr.includes(`,${organizationId}|`) && !payersStr.endsWith(`,${organizationId}`)) {
            return this.router.createUrlTree(['/']);
          }
        } else {
          authority = localStorage.getItem(providerId + payerId);
          if (providerId == null || providerId == '' || payerId == null || payerId == '' || authority == null) {
            return this.router.createUrlTree(['/']);
          }
          if (!authority.includes('3.0') && authority.includes('3.9') && authority.includes('3.91')) {
            return this.router.createUrlTree(['/']);
          }
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
      return this._isAdminOrRcm();
    } else if (segments[0].path == 'claims') {
      return true;
    } else if (segments[0].path == 'configurations') {
      try {
        const providerId = localStorage.getItem('provider_id');
        const userPrivileges = localStorage.getItem(`${providerId}101`);
        return userPrivileges.split('|').includes('3.0');
      } catch (error) {
        console.log(error);
        return false;
      }
    }

  }

  private _isOnlyAdmin(): boolean {
    const item = localStorage.getItem('101101');
    const providerId = localStorage.getItem('provider_id');
    const isProvider = this.getPayersList().some(payer => {
      const userPrivileges = localStorage.getItem(`${providerId}${payer.id}`);
      return userPrivileges != null && userPrivileges.split('|').includes('3.0');
    });
    return !isProvider && item != null && (item.includes('|22') || item.startsWith('22'));
  }

  private _isOnlyRcm(): boolean {
    const item = localStorage.getItem('101101');
    const providerId = localStorage.getItem('provider_id');
    const isProvider = this.getPayersList().some(payer => {
      const userPrivileges = localStorage.getItem(`${providerId}${payer.id}`);
      return userPrivileges != null && userPrivileges.split('|').includes('3.0');
    });
    return !isProvider && item != null && (item.includes('|24') || item.startsWith('24'));
  }

  private _isDoctorOrCoder(): boolean {
    const item = localStorage.getItem('101101');
    return item != null && (item.includes('|24.41') || item.startsWith('24.41') || item.includes('|24.42') || item.startsWith('24.42'));
  }

  private _isOnlyPayerUser(): boolean {

    const providerId = localStorage.getItem('provider_id');
    const userPrivileges = localStorage.getItem(`${providerId}101`);
    return userPrivileges != null && userPrivileges.split('|').includes('99.0');

  }

  private _isAdminOrRcm(): boolean {
    const item = localStorage.getItem('101101');
    return item != null && (item.includes('|22') || item.startsWith('22') || item.includes('|24') || item.startsWith('24'));
  }

  getPayersList(globMed?: boolean): { id: number, name: string, arName: string }[] {
    if (globMed == null) {
      globMed = false;
    }
    const payers: { id: number, name: string, arName: string }[] = [];
    const payersStr = localStorage.getItem('payers');
    if (payersStr != null && payersStr.trim().length > 0 && payersStr.includes('|')) {
      const payersStrSplitted = payersStr.split('|');
      payersStrSplitted
        .filter(value =>
          (!globMed && value.split(':')[1].split(',')[3] != 'GlobeMed')
          || (globMed && value.split(':')[1].split(',')[3] == 'GlobeMed'))
        .map(value => payers.push({
          id: Number.parseInt(value.split(':')[0], 10),
          name: value.split(':')[1].split(',')[0],
          arName: value.split(':')[1].split(',')[1]
        }));
    } else if (payersStr != null && payersStr.trim().length > 0 && payersStr.includes(':')) {
      return [{
        id: Number.parseInt(payersStr.split(':')[0], 10),
        name: payersStr.split(':')[1].split(',')[0],
        arName: payersStr.split(':')[1].split(',')[1]
      }];
    }

    return payers;
  }

}
