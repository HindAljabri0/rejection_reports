import { Component, OnInit, Input } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationTypes } from 'src/app/models/notificationsTypes';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification:Notification;
  date:string;

  constructor() { }

  ngOnInit() {
    if(this.notification != null){
      this.date = `${this.notification.datetime.getFullYear()}/${this.notification.datetime.getMonth()+1}/${this.notification.datetime.getDate()}`
    }
  }

  isBatchNotification(type:NotificationTypes){
    return type == NotificationTypes.batch;
  }

  parseInt(str:string){
    return Number.parseInt(str);
  }

}
