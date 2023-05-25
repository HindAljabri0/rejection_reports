import { F } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { error } from 'console';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-add-edit-notification-dialog',
  templateUrl: './add-edit-notification-dialog.component.html',
  styles: []
})
export class AddEditNotificationDialogComponent implements OnInit {


  fileName: string = '';
  fileType: string = '';
  fileData = '';
  pipe = new DatePipe("en-US")
  announcement: AnnouncementNotification = {
    userName: '',
    subject: '',
    descreption: '',
    startDate: '',
    endDate: '',
    attachments: []
  };
  isCreatedAnnouncement = false;
  constructor(private dialogRef: MatDialogRef<AddEditNotificationDialogComponent>,
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
    this.announcement.attachments = [{
      attachment: this.fileData,
      attachmentName: this.fileName,
      attachmentType: this.fileType
    }]

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
  onFileSelected(event) {

    const files: File = event.target.files[0];
    if (files) {
      console.log(files)
      let reader = new FileReader();
      reader.readAsDataURL(files as Blob);
      reader.onload = () => {
        this.fileData = reader.result as string;
        console.log(reader.result as string)
      }

      let splitFileName = files.name.split(".");
      this.fileType = files.type;
      this.fileName = files.name ;
      console.log( this.fileType)

    }
  }
}