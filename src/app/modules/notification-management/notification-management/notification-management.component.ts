import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditNotificationDialogComponent } from '../add-edit-notification-dialog/add-edit-notification-dialog.component';
import { ViewNotificationDetailsDialogComponent } from '../view-notification-details-dialog/view-notification-details-dialog.component';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { error } from 'console';
import { instances } from 'chart.js';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

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
    public sharedServices: SharedServices,
    private superAdmin: SuperAdminService,
    private dialogService: DialogService

  ) { }

  ngOnInit() {
    this.getAllAnnouncements();
  }

  openAddCreateNotificationDialog() {
    const dialogRef = this.dialog.open(AddEditNotificationDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false,
      data: {
        providersInfo: this.providersInfo
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.getAllAnnouncements();
      }
    }

    )
  }

  openViewNotificationDialog(announcementId: string) {
    const dialogRef = this.dialog.open(ViewNotificationDetailsDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false,
      data: {
        announcementId: announcementId,
        providersInfo: this.providersInfo
      }
    })
  }
  deleteAnnouncements(announcementId: string) {
    this.sharedServices.loadingChanged.next(true);
    this.notificationsService.deleteAnnouncement(announcementId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status == 201 || event.status) {

          this.dialogService.openMessageDialog({
            title: '',
            message: `Announcement has been deleted`,
            isError: false
          });
          let response = event;
          console.log(response)
          this.sharedServices.loadingChanged.next(false);
          this.getAllAnnouncements();
        }
      }
    }, (error => {
      if (error instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: error.message,
          isError: true
        });
        this.sharedServices.loadingChanged.next(false);
      }
    }))

  }
  dialogConfirtToDelete(announcementId: string) {
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Announcement?',
        `This will delete this Announcement. Are you sure you want to delete it? This cannot be undone.`,
        false,
        true)).subscribe(result => {
          if (result === true) {
            this.deleteAnnouncements(announcementId);
          }
        })
  }


  convertProvidersfromStringToList(providerIds: string) {
    return providerIds.replace(/id:|}|{|\[|]/gi, '').split(',').toString();
  }
  getAllAnnouncements() {
    this.sharedServices.loadingChanged.next(true);
    this.notificationsService.getAllAnnouncements(this.page, this.pageSize).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.Announcements = null;
        this.Announcements = event.body["content"] as any[];
        this.totalPages = event.body["totalElements"] as string;

        console.log(this.Announcements)
        if (this.providersInfo.length == 0) {
          this.getProviders();
        } else {
          this.sharedServices.loadingChanged.next(false);
        }

      }
    }, (error => {
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    }))
  }

  getProviders() {
    //  this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providersInfo = event.body;
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.error = 'could not load providers, please try again later.';
      console.log(error);
    });
  }
  handlePageChange(event) {
    console.log(event.pageIndex)
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllAnnouncements();
  }
}
