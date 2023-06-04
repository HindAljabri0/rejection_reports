import { F } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
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
    private notificationsService: NotificationsService,
    public sharedServices: SharedServices,
    public authService: AuthService,
    private dialogService: DialogService) { }

  announcementForm = new FormGroup({
    subjectControl: new FormControl(''),
    descriptionControl: new FormControl(''),
    startDateControl: new FormControl(''),
    endDateControl: new FormControl(''),
    providersControl: new FormControl('')
  });

  ngOnInit() {
    console.log(this.authService.getUserName())
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;

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

  selectProvider(provider: any = null) {
    console.log(provider)
    switch (provider) {
      case "All":
        this.allProviders = true;
        this.allNphiesProviders = false;
        this.allWaseelProviders = false;
        this.announcementForm.controls.providersControl.setValue('');
        this.SelectedPrividerType = 'All'
        return
      case "NPHIES":
        this.allProviders = false;
        this.allNphiesProviders = true;
        this.allWaseelProviders = false;
        this.announcementForm.controls.providersControl.setValue('');
        this.SelectedPrividerType = 'NPHIES'
        return

      case "Waseel":
        this.allProviders = false;
        this.allNphiesProviders = false;
        this.allWaseelProviders = true;
        this.announcementForm.controls.providersControl.setValue('');
        this.SelectedPrividerType = 'Wassel'
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

    this.announcement.providerIds = this.SelectedPrividerType != null ? [this.SelectedPrividerType] : this.providerIds;
    this.announcement.userName = this.authService.getAuthUsername();
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
    console.log(new Blob([files]))
    if (this.checkfileType(files.name) !== 'unKnown') {
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