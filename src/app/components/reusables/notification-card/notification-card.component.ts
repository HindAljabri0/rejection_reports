import { Component, OnInit, Input } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationTypes } from 'src/app/models/notificationsTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification:Notification;
  date:string;

  constructor(private router:Router) { }

  ngOnInit() {
    if(this.notification != null){
      this.date = `${this.notification.datetime.getFullYear()}/${this.notification.datetime.getMonth()+1}/${this.notification.datetime.getDate()}`
    }
  }


  isRead(){
    return this.notification.status == 'read';
  }

  isBatchNotification(){
    return this.notification.type == NotificationTypes.BATCH_SUMMARY_INQUIRY;
  }

  parseInt(str:string){
    return Number.parseInt(str);
  }

  typeToString(){
    switch(this.notification.type){
      case NotificationTypes.BATCH_SUMMARY_INQUIRY:
        return 'Batch Notification';
    }
  }

  getBatchclaims(){
    //console.log(this.notification.sourceId);
    this.router.navigate([this.notification.sourceId, 'claims'], { queryParams: { batchId:this.notification.reference } });
  }

}
