import { Component, OnInit, Input } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationTypes } from 'src/app/models/notificationsTypes';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification:Notification = new Notification({
    id:1,
    type: `${NotificationTypes.BatchNotification}`,
    message: 'new batch update',
    reference: '13254',
    datetime: new Date(),
    targetId: '102',
    sourceId: '104',
    targetUser: '0'
  });
  date:string;

  constructor() { }

  ngOnInit() {
    if(this.notification != null){
      this.date = `${this.notification.datetime.getFullYear()}/${this.notification.datetime.getMonth()+1}/${this.notification.datetime.getDate()}`
    }
  }

}
