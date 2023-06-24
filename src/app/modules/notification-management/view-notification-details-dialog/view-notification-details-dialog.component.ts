import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { file } from 'jszip';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-view-notification-details-dialog',
  templateUrl: './view-notification-details-dialog.component.html',
  styles: []
})
export class ViewNotificationDetailsDialogComponent implements OnInit {
  Announcement: any = {};
  providerIds: string[] = []
  selectedProviders: any[] = []
  providersInfo: any[] = []

  error = '';
  constructor(private dialogRef: MatDialogRef<ViewNotificationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices,
    private superAdmin: SuperAdminService,) { }



  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.providersInfo = this.data.providersInfo;

    this.notificationsService.getAnnouncement(this.data.announcementId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.Announcement = event.body as any;
        this.providerIds = this.Announcement.providerId.replace(/id:|}|{|\[|]/gi, '').split(',');
        console.log(this.providerIds[0]);
        console.log(this.isSelectedAllProvider());
        if (!this.isSelectedAllProvider()) {
          this.providerIds.forEach(providerId => {
            this.providersInfo.forEach(provider => {
              if (providerId == provider.switchAccountId) {
                this.selectedProviders.push(provider)
              }
            })

          })
        }
        this.sharedServices.loadingChanged.next(false);
      }

    }, (error => {
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    }))


  }
  isSelectedAllProvider() {
    return (this.providerIds[0] == 'ALL' || this.providerIds[0] == 'NPHIES' || this.providerIds[0] == 'WASEEL');
  }

  closeDialog() {

    this.dialogRef.close();
  }

  openFile(attachmentContent: string, fileType: string, fileName: string) {
    let blob = this.convertBase64ToBlob(attachmentContent, fileType);
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL)
  }


  convertBase64ToBlob(Base64: string, contentType: string) {
    const byteArray = new Uint8Array(atob(Base64).split('').map((char) => char.charCodeAt(0)));
    return new Blob([byteArray], { type: contentType });
  }


  checkfileType(fileName: string) {
    let fileExtension = fileName.split(".")[1];
    let src = './assets/file-types/'
    switch (fileExtension.toUpperCase()) {
      case "PDF":
        return src + "ic-pdf.svg"
      case "XLS":
        return src + "ic-xls.svg"
      case "CSV":
        return src + "ic-csv.svg"
      case "ZIP":
        return src + "ic-zip.svg"
      case "XLSX":
        return src + "ic-xls.svg"
      case "JPG":
        return src + "ic-jpg.svg"
      case "PNG":
        return src + "ic-jpg.svg"
      default:
        return 'unKnown'
    }

  }

}
