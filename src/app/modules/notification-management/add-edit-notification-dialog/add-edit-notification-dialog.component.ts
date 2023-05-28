import { F } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { error } from 'console';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-add-edit-notification-dialog',
  templateUrl: './add-edit-notification-dialog.component.html',
  styles: []
})
export class AddEditNotificationDialogComponent implements OnInit {

  pipe = new DatePipe("en-US")
  announcement: AnnouncementNotification = {
    userName: '',
    subject: '',
    descreption: '',
    startDate: '',
    endDate: '',
    attachments: []
  };
  providers :any [];
  attachments: any[] = [];
  error:string;
  
  indixOfelement = 0;
  isCreatedAnnouncement = false;
  constructor(private dialogRef: MatDialogRef<AddEditNotificationDialogComponent>,
    private superAdmin: SuperAdminService,
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices) { }

  announcementForm = new FormGroup({
    subjectControl: new FormControl(''),
    descriptionControl: new FormControl(''),
    startDateControl: new FormControl(''),
    endDateControl: new FormControl(''),
    providersControl: new FormControl('')
  });

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
      //    this.filteredProviders = this.providers;
  
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.error = 'could not load providers, please try again later.';
      console.log(error);
    });

  }

  closeDialog() {
    this.dialogRef.close(
      this.isCreatedAnnouncement
    );
  }


  setData() {
    this.announcement.providerId = this.announcementForm.controls.providersControl.value;
    this.announcement.subject = this.announcementForm.controls.subjectControl.value;
    this.announcement.descreption = this.announcementForm.controls.descriptionControl.value;
    this.announcement.startDate = this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), "yyyy-MM-dd");
    this.announcement.endDate = this.pipe.transform(new Date(this.announcementForm.controls.endDateControl.value), "yyyy-MM-dd");
    this.announcement.attachments = this.attachments;

  }

  saveAnnouncement() {
    this.sharedServices.loadingChanged.next(true);
    this.setData();
    this.notificationsService.createAnnouncement(this.announcement).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = event;
        console.log(response)
        this.sharedServices.loadingChanged.next(false);
        this.isCreatedAnnouncement = true;
        this.closeDialog();

      }

    }, error => {
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    })

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
        return src + "ic-csv.svg"
      default:
        return src
    }

  }
  onFileSelected(event) {
    this.indixOfelement = this.indixOfelement + 1;
    console.log(this.indixOfelement);
    const files: File = event.target.files[0];
    console.log(new Blob([files]))
    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = () => {
        let fileData: string = reader.result as string;
        fileData = fileData.substring(fileData.indexOf(',') + 1);
        let attachment = {
          id: this.indixOfelement,
          attachment: fileData,
          attachmentName: files.name,
          attachmentType: files.type
        }
        this.attachments.push(attachment)


      }

    }
  }

  deleteAttachment(indexElement) {
    console.log(indexElement)
    this.attachments.forEach((attachment, index) => {
      if (attachment.id == indexElement) this.attachments.splice(index, 1)
    })
  }
}