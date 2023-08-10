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
    surveyId: '',
    content: '',
    surveyName: '',
    isActive: '',


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
  isActive: any;
  details: any;
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
    providersControl: new FormControl(''),
    status: new FormControl(''),
  });

  ngOnInit() {
    this.providers = this.data.providersInfo;
    this.surveyId = this.data.surveyId;
    this.isActive = this.data.status;
    this.filteredProviders = this.providers;
    this.announcementForm.controls.status.setValue(this.data.details.isActive);
    if (this.data.details.startDate === null) {
      this.announcementForm.controls.startDateControl.setValue(new Date());
    }
    if (this.data.details.closeDate === null) {
      this.announcementForm.controls.closeDateControl.setValue(new Date());
    }
    else {
      this.announcementForm.controls.startDateControl.setValue(new Date(this.data.details.startDate));
      this.announcementForm.controls.closeDateControl.setValue(new Date(this.data.details.closeDate));
    } 
    this.announcementForm.controls.providersControl.setValue(this.data.details.providerId);
  }

  closeDialog() {
    this.dialogRef.close(
      this.isCreatedAnnouncement
    );
  }

  selectProvider(provider: any = null) {
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
    this.selectedProviders.forEach(provide => {
      this.providerIds.push(provide.switchAccountId);
    });
    this.announcement.providerIds = this.SelectedPrividerType != null ? [this.SelectedPrividerType.toLocaleUpperCase()] : this.providerIds;
    this.announcement.startDate = this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), 'yyyy-MM-dd hh:mm:ss');
    this.announcement.closeDate = this.pipe.transform(new Date(this.announcementForm.controls.closeDateControl.value), 'yyyy-MM-dd hh:mm:ss');
    this.announcement.surveyId = this.surveyId;
    this.announcement.isActive = this.announcementForm.controls.status.value;
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
    if (this.announcementForm) {
      this.sharedServices.loadingChanged.next(true);
      this.setData();
      this._feedbackservice.updateSurvey(this.announcement).subscribe(event => {
        if (event instanceof HttpResponse) {       
          this.sharedServices.loadingChanged.next(false);
          this.dialogService.openFeedbackDialog({
            title: '',
            message: `Provider and date has been selected`,
            isError: false
          }); 
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
      if (provider.switchAccountId === providerId) {
        isaProviderThere = true;
        return;
      }

    });
    return isaProviderThere;
  }
}
