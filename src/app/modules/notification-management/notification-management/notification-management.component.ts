import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditNotificationDialogComponent } from '../add-edit-notification-dialog/add-edit-notification-dialog.component';
import { ViewNotificationDetailsDialogComponent } from '../view-notification-details-dialog/view-notification-details-dialog.component';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';
import { HttpResponse } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styles: []
})
export class NotificationManagementComponent implements OnInit {

  Announcements: any[] ;

  constructor(
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices

  ) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.notificationsService.getAllAnnouncements().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.Announcements = event.body as any[];
        console.log(this.Announcements)
      }
      this.sharedServices.loadingChanged.next(false);
    }, (error => {
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    }))
    
  }

  openAddCreateNotificationDialog() {
    const dialogRef = this.dialog.open(AddEditNotificationDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    })
  }

  openViewNotificationDialog() {
    const dialogRef = this.dialog.open(ViewNotificationDetailsDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    })
  }

}
