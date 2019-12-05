import { Component, OnInit } from '@angular/core';
import {CommenServicesService} from '../../services/commen-services.service'
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;

  notificationIconClasses = "mat-icon-button mat-button-base ";

  constructor(private commen:CommenServicesService, public router:Router, public authService:AuthService) {
    this.commen.unReadNotificationsCountChange.subscribe(count => {
        this.setNewNotificationIndecater(count > 0);
    })
  }

  get loading():boolean{
    return this.commen.loading;
  }

  ngOnInit() {
  }

  setNewNotificationIndecater(show:boolean){
    if(show){
      this.notificationIconClasses = "mat-icon-button mat-button-base hasNotifications";
    } else {
      this.notificationIconClasses = "mat-icon-button mat-button-base ";
    }
  }

  toggleNotificationCenter(){
    this.commen.showNotificationCenterChange.next(!this.commen.showNotificationCenter);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
