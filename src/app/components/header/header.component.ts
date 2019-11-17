import { Component, OnInit } from '@angular/core';
import {CommenServicesService} from '../../services/commen-services.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;

  notificationIconClasses = "mat-icon-button mat-button-base ";

  constructor(private commen:CommenServicesService) {
    
  }

  get loading():boolean{
    return this.commen.loading;
  }

  ngOnInit() {
  }

  setNewNotificationIndecater(show:boolean){
    if(show){
      this.notificationIconClasses += "hasNotifications";
    } else {
      this.notificationIconClasses = "mat-icon-button mat-button-base ";
    }
  }

  toggleNotificationCenter(){
    this.commen.showNotificationCenterChange.next(!this.commen.showNotificationCenter);
  }

}
