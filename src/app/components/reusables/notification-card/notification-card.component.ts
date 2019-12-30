import { Component, OnInit, Input } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationTypes } from 'src/app/models/notificationsTypes';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification:Notification;
  date:string;

  constructor(private router:Router,public notificationService:NotificationsService,public commen: CommenServicesService) { }

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
    this.notification.status = 'read';
    this.notificationService.markNotificationAsRead(this.notification.sourceId, String(this.notification.id)).subscribe(event => {
      if(event instanceof HttpResponse){
        this.router.navigate([this.notification.sourceId, 'claims'], { queryParams: { batchId:this.notification.reference } });
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        this.commen.openDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true));        
      }
    });
   
  }

}
