import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementsService } from 'src/app/services/announcementService/announcements.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { Announcement } from 'src/app/models/announcement';

@Component({
  selector: 'app-announcement-card',
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.css']
})
export class AnnouncementCardComponent implements OnInit {

  @Input() announcement:Announcement;
    date:string;

  constructor(private router:Router,public announcementService:AnnouncementsService,public dialogService:DialogService) { }

  ngOnInit() {
    if(this.announcement != null){
    //  this.date = `${this.notification.datetime.getFullYear()}/${this.notification.datetime.getMonth()+1}/${this.notification.datetime.getDate()}`
    }
  }


  //isRead(){
  //  return this.notification.status == 'read';
  //}

  //isBatchNotification(){
  //  return this.notification.type == NotificationTypes.BATCH_SUMMARY_INQUIRY;
  //}

  parseInt(str: string) {
    return Number.parseInt(str);
  }

  //typeToString() {
   // switch (this.notification.type) {
   //   case NotificationTypes.BATCH_SUMMARY_INQUIRY:
   //     return 'Batch Notification';
   // }
  //}

  getAnnouncements() {
    //this.notification.status = 'read';
    this.announcementService.getAnnouncements('104' , '204', 0, 10)
    .subscribe(event => {
      if (event instanceof HttpResponse) {
        this.router.navigate([this.announcement.messageId, 'claims'],
        { queryParams: { batchId: this.announcement.messageDescription } });
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog(new MessageDialogData('',
         'Could not reach the server. Please try again later.', true));
      }
    });
   }

}
