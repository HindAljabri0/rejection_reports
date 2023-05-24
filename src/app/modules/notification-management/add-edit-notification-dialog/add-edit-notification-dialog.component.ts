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

  pipe = new DatePipe("en-US")
  announcement: AnnouncementNotification={
    userName: '',
    subject: '',
    descreption: '',
    startDate: '',
    endDate: '',
    attachments: []
  };
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
    console.log(this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), "MM/dd/yyyy"))
    this.dialogRef.close();
  }


  setData() {
    this.announcement.providerId = this.announcementForm.controls.providersControl.value;
    this.announcement.subject = this.announcementForm.controls.subjectControl.value;
    this.announcement.descreption = this.announcementForm.controls.descriptionControl.value;
    this.announcement.startDate = this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), "yyyy-MM-dd");
    this.announcement.endDate = this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), "yyyy-MM-dd");
    this.announcement.attachments = [{
      attachment: null,
      attachmentName: 'test',
      attachmentType: "test2"
    }]

  }

  saveAnnouncement(){
    this.sharedServices.loadingChanged.next(true);
    this.setData();
    this.notificationsService.createAnnouncement(this.announcement).subscribe(event=>{
      
        let response =event;
        console.log(response)
        this.sharedServices.loadingChanged.next(false);
         this.closeDialog();
        
       
      
    },error=>{
      console.log(error)
      this.sharedServices.loadingChanged.next(false);
    })

  }
}
