import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-view-notification-details-dialog',
  templateUrl: './view-notification-details-dialog.component.html',
  styles: []
})
export class ViewNotificationDetailsDialogComponent implements OnInit {
  Announcement: any={};
  constructor(private dialogRef: MatDialogRef<ViewNotificationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices) { }

  ngOnInit() {
    
      this.sharedServices.loadingChanged.next(true);
      this.notificationsService.getAnnouncement(this.data.announcementId).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.Announcement = event.body as any;
          console.log(this.Announcement)
          this.sharedServices.loadingChanged.next(false);
        }
  
      }, (error => {
        console.log(error)
        this.sharedServices.loadingChanged.next(false);
      }))
    

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
