import { F } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { error } from 'console';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { AuthService } from 'src/app/services/authService/authService.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';
import { FeedbackDate } from './feedback-date.model';

@Component({
  selector: 'app-add-feedback-date-dialog',
  templateUrl: './feedback-select-date.component.html',
  styles: []
})
export class AddFeedbackDateDialogComponent implements OnInit {
  selectedProvider: string;
  pipe = new DatePipe('en-US');
  announcement: FeedbackDate = {
    providerIds: [],
    
 
    startDate: '',
    closeDate: '',
    surveyId:'',
    content:'',
    surveyName:''
  
  };
  submit = false;
  allProviders = false;
  allNphiesProviders = false;
  allWaseelProviders = false;
  feedback = new FeedbackDate();
  providerIds: string[] = [];
  providers: any[];
  attachments: any[] = [];
  error: string;
  filteredProviders: any[] = [];
  selectedProviders: any[] = [];
  SelectedPrividerType = null;
  indixOfelement = 0;
  isCreatedAnnouncement = false;
  surveyId: any;
  constructor(private dialogRef: MatDialogRef<AddFeedbackDateDialogComponent>,
              private superAdmin: SuperAdminService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationsService: NotificationsService,
              public sharedServices: SharedServices,
              public authService: AuthService,
              private dialogService: DialogService,
              private _feedbackservice: FeedbackService) { }

  announcementForm = new FormGroup({
   
    startDateControl: new FormControl('', [
      Validators.required
    ]),
    closeDateControl: new FormControl('', [
      Validators.required
    ]),
    providersControl: new FormControl('')
  });

  ngOnInit() {
    console.log(this.authService.getUserName());
    this.providers = this.data.surveyId;
    this.surveyId = this.data.surveyId;
    console.log(  this.providers,"sjkksk")
    this.filteredProviders = this.providers;
  }

  closeDialog() {
    this.dialogRef.close(
      this.isCreatedAnnouncement
    );
  }

  selectProvider(provider: any = null) {
    console.log(provider);
    switch (provider) {
      case 'All':
        this.allProviders = true;
        this.allNphiesProviders = false;
        this.allWaseelProviders = false;
        this.selectedProviders = [];
        this.announcementForm.controls.providersControl.setValue('');
        this.SelectedPrividerType = 'All';
        return;
      case 'NPHIES':
        this.allProviders = false;
        this.allNphiesProviders = true;
        this.allWaseelProviders = false;
        this.announcementForm.controls.providersControl.setValue('');
        this.selectedProviders = [];
        this.SelectedPrividerType = 'NPHIES';
        return;

      case 'Waseel':
        this.allProviders = false;
        this.allNphiesProviders = false;
        this.allWaseelProviders = true;
        this.announcementForm.controls.providersControl.setValue('');
        this.selectedProviders = [];
        this.SelectedPrividerType = 'Waseel';
        return;
      default:
        this.allProviders = false;
        this.allNphiesProviders = false;
        this.allWaseelProviders = false;
        this.SelectedPrividerType = null;
        this.announcementForm.controls.providersControl.setValue('');
        console.log(this.isProviderSelected(provider.switchAccountId));
        if (!this.isProviderSelected(provider.switchAccountId)) {
          this.selectedProviders.push(provider);
        }
        return;
    }


  }


  cancelSelectedProviders(providerId) {
    this.allProviders = false;
    this.allNphiesProviders = false;
    this.allWaseelProviders = false;

    this.selectedProviders.forEach((provider, index) => {
      if (provider.switchAccountId === providerId) { this.selectedProviders.splice(index, 1); }
    });
  }
  setData() {

    console.log(this.selectedProviders);
    this.selectedProviders.forEach(provide => {
      this.providerIds.push(provide.switchAccountId);

    });
    console.log(this.providerIds);

    this.announcement.providerIds = this.SelectedPrividerType != null ? [this.SelectedPrividerType.toLocaleUpperCase()] : this.providerIds;

    this.announcement.startDate = this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), 'yyyy-MM-dd hh:mm:ss');
    this.announcement.closeDate = this.pipe.transform(new Date(this.announcementForm.controls.closeDateControl.value), 'yyyy-MM-dd hh:mm:ss');
    this.announcement.surveyId = this.surveyId;

  }


  hasError(controlsName: string) {
    switch (controlsName) {
    case 'providersControl':
        return this.selectedProviders.length === 0 && this.submit && !this.allProviders &&
          !this.allNphiesProviders && !this.allWaseelProviders ? 'It Should At least Add One Provider.' : null;
      case 'startDateControl':
        return this.announcementForm.controls.startDateControl.invalid && this.submit ? 'Please Select Start Date' : null;
      case 'closeDateControl':
        return this.announcementForm.controls.closeDateControl.invalid && this.submit ? 'Please Select End Date' : null;
    }



  }
  saveAnnouncement() {
    this.submit = true;
    console.log(this.announcementForm);
    if (this.announcementForm) {
      this.sharedServices.loadingChanged.next(true);
      this.setData();
      this._feedbackservice.postSurveyDate(this.announcement).subscribe(event => {     
         
          if (event) {
            this.sharedServices.loadingChanged.next(false);
            this.dialogService.openMessageDialog({
              title: '',
              message: `Date Range has been created`,
              isError: false
            });

            const response = event;
            console.log(response);
           
           

          }
        

      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.dialogService.openMessageDialog({
            title: '',
            message: error.message,
            isError: true
          });
          this.sharedServices.loadingChanged.next(false);
        }

      });
    }

  }

 
  get isLoading() {
    return this.sharedServices.loading;
  }

  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.cchiId} | ${provider.code} | ${provider.name}`.toLowerCase()
        .includes(this.announcementForm.controls.providersControl.value.toLowerCase())
    );
  }
 
  isProviderSelected(providerId: string) {
    let isaProviderThere = false;
    this.selectedProviders.forEach(provider => {
      console.log(provider);
      console.log(provider.switchAccountId);
      if (provider.switchAccountId === providerId) {
        isaProviderThere = true;
        return;
      }

    });
    return isaProviderThere;
  }
}
