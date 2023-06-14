import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { file } from 'jszip';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-view-notification-details-dialog',
  templateUrl: './view-notification-details-dialog.component.html',
  styles: []
})
export class ViewNotificationDetailsDialogComponent implements OnInit {
  Announcement: any = {};
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
      default:
        return src
    }

  }

 
}
