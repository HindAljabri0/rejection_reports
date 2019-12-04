import { Component, OnInit } from '@angular/core';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  status;
  notificationsList:Notification[];
  constructor(public commen:CommenServicesService) {
    this.commen.showNotificationCenterChange.subscribe(value => {
      this.toggleNotificationCenter(value);
    });
    this.commen.notificationsListChange.subscribe(list => {
      this.notificationsList = list;
    });
  }

  ngOnInit() {
    // this.commen.showNotificationCenterChange.next(true);
  }

  toggleNotificationCenter(show:boolean){
    if(show){
      this.status = "show";
    } else this.status = "";
  }

  get numOfUnreadNotifications(){
    return this.commen.unReadNotificationsCount;
  }

  // markAsRead(id:string){
  //   this.commen.markAsRead(id, "102");
  // }

}
