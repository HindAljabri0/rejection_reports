import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditNotificationDialogComponent } from '../add-edit-notification-dialog/add-edit-notification-dialog.component';
import { ViewNotificationDetailsDialogComponent } from '../view-notification-details-dialog/view-notification-details-dialog.component';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { error } from 'console';
import { instances } from 'chart.js';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styles: []
})
export class NotificationManagementComponent implements OnInit {

  Announcements: any[] = [];
  providersInfo: any[] = [];
  totalPages = "0";
  pageSizeOptions = [5, 10, 25, 100];
  page = 0;
  pageSize = 10;
  error = '';

  constructor(
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices

  ) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.getAllAnnouncements();

  }

  openAddCreateNotificationDialog() {
    const dialogRef = this.dialog.open(AddEditNotificationDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    }).afterClosed().subscribe(data => {
      if (data) {
        this.getAllAnnouncements();
      }
    }

    )
  }

  openViewNotificationDialog(announcementId:string) {
    const dialogRef = this.dialog.open(ViewNotificationDetailsDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false,
      data:{announcementId:announcementId}
    })
  }
  deleteAnnouncements(announcementId: string) {
    this.sharedServices.loadingChanged.next(true);
    this.notificationsService.deleteAnnouncement(announcementId).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = event;
        console.log(response)
        this.sharedServices.loadingChanged.next(false);
        this.getAllAnnouncements();
      }
    }, (error => {
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    }))

  }
  getAllAnnouncements() {
    this.sharedServices.loadingChanged.next(true);
    this.notificationsService.getAllAnnouncements().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.Announcements = null;
        this.Announcements = event.body as any[];
        console.log(this.Announcements)
        this.sharedServices.loadingChanged.next(false);
      }

    }, (error => {
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    }))
  }
  handlePageChange(event) {
    console.log(event.pageIndex)
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllAnnouncements();
  }
}
