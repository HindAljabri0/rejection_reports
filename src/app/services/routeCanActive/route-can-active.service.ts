import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authService/authService.service';


@Injectable({
  providedIn: 'root'
})
export class RouteCanActiveService implements CanActivate {

  constructor(public authService:AuthService, public router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('here');
    if(!this.authService.loggedIn ){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  
}
