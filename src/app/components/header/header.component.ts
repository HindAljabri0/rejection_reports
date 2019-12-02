import { Component, OnInit } from '@angular/core';
import {CommenServicesService} from '../../services/commen-services.service'
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;

  notificationIconClasses = "mat-icon-button mat-button-base ";

  constructor(private commen:CommenServicesService) {
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

}
