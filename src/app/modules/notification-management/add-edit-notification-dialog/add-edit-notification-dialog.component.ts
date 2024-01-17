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
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-add-edit-notification-dialog',
  templateUrl: './add-edit-notification-dialog.component.html',
  styles: []
})
export class AddEditNotificationDialogComponent implements OnInit {
  selectedProvider: string;
  pipe = new DatePipe("en-US")
  announcement: AnnouncementNotification = {
    providerIds: [],
    userName: '',
    subject: '',
    descreption: '',
    startDate: '',
    endDate: '',
    attachments: []
  };
  submit = false;
  allProviders = false;
  allNphiesProviders = false;
  allWaseelProviders = false;

  providerIds: string[] = [];
  providers: any[];
  attachments: any[] = [];
  error: string;
  filteredProviders: any[] = [];
  selectedProviders: any[] = [];
  SelectedPrividerType = null;
  indixOfelement = 0;
  isCreatedAnnouncement = false;
  constructor(private dialogRef: MatDialogRef<AddEditNotificationDialogComponent>,
    private superAdmin: SuperAdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices,
    public authService: AuthService,
    private dialogService: DialogService) { }

  announcementForm = new FormGroup({
    subjectControl: new FormControl('', [
      Validators.required
    ]),
    descriptionControl: new FormControl('', [
      Validators.required
    ]),
    startDateControl: new FormControl('', [
      Validators.required
    ]),
    endDateControl: new FormControl('', [
      Validators.required
    ]),
    providersControl: new FormControl('')
  });

  ngOnInit() {
    console.log(this.authService.getUserName())
    this.providers = this.data.providersInfo;
    this.filteredProviders = this.providers;
  }

  closeDialog() {
    this.dialogRef.close(
      this.isCreatedAnnouncement
    );
  }

  selectProvider(provider: any = null) {
    console.log(provider)
    switch (provider) {
      case "All":
        this.allProviders = true;
        this.allNphiesProviders = false;
        this.allWaseelProviders = false;
        this.selectedProviders = [];
        this.announcementForm.controls.providersControl.setValue('');
        this.SelectedPrividerType = 'All'
        return
      case "NPHIES":
        this.allProviders = false;
        this.allNphiesProviders = true;
        this.allWaseelProviders = false;
        this.announcementForm.controls.providersControl.setValue('');
        this.selectedProviders = [];
        this.SelectedPrividerType = 'NPHIES'
        return

      case "Waseel":
        this.allProviders = false;
        this.allNphiesProviders = false;
        this.allWaseelProviders = true;
        this.announcementForm.controls.providersControl.setValue('');
        this.selectedProviders = [];
        this.SelectedPrividerType = 'Waseel'
        return
      default:
        this.allProviders = false;
        this.allNphiesProviders = false;
        this.allWaseelProviders = false;
        this.SelectedPrividerType = null
        this.announcementForm.controls.providersControl.setValue('');
        console.log(this.isProviderSelected(provider.switchAccountId))
        if (!this.isProviderSelected(provider.switchAccountId)) {
          this.selectedProviders.push(provider);
        }
        return
    }


  }


  cancelSelectedProviders(providerId) {
    this.allProviders = false;
    this.allNphiesProviders = false;
    this.allWaseelProviders = false;

    this.selectedProviders.forEach((provider, index) => {
      if (provider.switchAccountId == providerId) this.selectedProviders.splice(index, 1);
    });
  }
  setData() {

    console.log(this.selectedProviders)
    this.selectedProviders.forEach(provide => {
      this.providerIds.push(provide.switchAccountId);

    })
    console.log(this.providerIds)

    this.announcement.providerIds = this.SelectedPrividerType != null ? [this.SelectedPrividerType.toLocaleUpperCase()] : this.providerIds;
    this.announcement.userName = this.authService.getAuthUsername();
    this.announcement.subject = this.announcementForm.controls.subjectControl.value;
    this.announcement.descreption = this.announcementForm.controls.descriptionControl.value;
    this.announcement.startDate = this.pipe.transform(new Date(this.announcementForm.controls.startDateControl.value), "yyyy-MM-dd");
    this.announcement.endDate = this.pipe.transform(new Date(this.announcementForm.controls.endDateControl.value), "yyyy-MM-dd");
    this.announcement.attachments = this.attachments;

  }


  hasError(controlsName: string) {
    switch (controlsName) {
      case "subjectControl":
        return this.announcementForm.controls.subjectControl.invalid && this.submit ? "It Should Add a Subject." : null
      case "descriptionControl":
        return this.announcementForm.controls.descriptionControl.invalid && this.submit ? "It Should Add a Description." : null
      case "providersControl":
        return this.selectedProviders.length == 0 && this.submit && !this.allProviders &&
          !this.allNphiesProviders && !this.allWaseelProviders ? "It Should At least Add One Provider." : null
      case "startDateControl":
        return this.announcementForm.controls.startDateControl.invalid && this.submit ? "Please Select Start Date" : null
      case "endDateControl":
        return this.announcementForm.controls.endDateControl.invalid && this.submit ? "Please Select End Date" : null
    }



  }
  saveAnnouncement() {
    this.submit = true;
    console.log(this.announcementForm.valid)
    if (this.announcementForm.valid) {
      this.sharedServices.loadingChanged.next(true);
      this.setData();
      this.notificationsService.createAnnouncement(this.announcement).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status == 201 || event.status) {

            this.dialogService.openMessageDialog({
              title: '',
              message: `Announcement has been created`,
              isError: false
            });

            let response = event;
            console.log(response)
            this.sharedServices.loadingChanged.next(false);
            this.isCreatedAnnouncement = true;
            this.closeDialog();

          }
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

      })
    }

  }

  checkfileType(fileName: string) {
    let fileExtension = fileName.split(".").pop();
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
      case "JPG":
        return src + "ic-jpg.svg"
      case "PNG":
        return src + "ic-jpg.svg"
      default:
        return 'unKnown'
    }

  }
  onFileSelected(event) {
    this.indixOfelement = this.indixOfelement + 1;
    console.log(this.indixOfelement);
    const files: File = event.target.files[0];
    const fileSizeMB = files.size / 1024 / 1024;
    console.log(fileSizeMB)
    console.log(new Blob([files]))
    if (this.checkfileType(files.name) !== 'unKnown' && fileSizeMB < 11) {
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
  deleteAttachment(indexElement) {
    console.log(indexElement)
    this.attachments.forEach((attachment, index) => {
      if (attachment.id == indexElement) this.attachments.splice(index, 1)
    })
  }

  isProviderSelected(providerId: string) {
    let isaProviderThere = false;
    this.selectedProviders.forEach(provider => {
      console.log(provider)
      console.log(provider.switchAccountId)
      if (provider.switchAccountId === providerId) {
        isaProviderThere = true;
        return;
      }

    });
    return isaProviderThere;
  }
}