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
  selectedProvider: string;
  // providerController: FormControl = new FormControl();
  pipe = new DatePipe("en-US")
  announcement: AnnouncementNotification = {
    userName: '',
    subject: '',
    descreption: '',
    startDate: '',
    endDate: '',
    attachments: []
  };
  providers: any[];
  attachments: any[] = [];
  error: string;
  filteredProviders: any[] = [];
  selectedProviders: any[] = [];
  isSelectedAll = false;
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
    // if (providerId !== null) {
    //   this.selectedProvider = providerId;
    // } else {
    //const provider = this.announcementForm.controls.providerController;

    this.announcementForm.controls.providersControl.setValue('');
    console.log(this.isProviderSelected(provider.switchAccountId))
    if (!this.isProviderSelected(provider.switchAccountId))
      this.selectedProviders.push(provider);
    // console.log(provider.switchAccountId + ' | ' + provider.code + ' | ' + provider.name + ' | ' + provider.cchiId);
    //.value.split('|')[0].trim();
    //this.selectedProvider = providerId;
    //  }
  }

  selectedAllProviders(ischecked) {
    //this.isSelectedAll = !ischecked;
    console.log(ischecked)
    if (ischecked) {
      this.selectedProviders = [];
      this.selectedProviders = this.providers;
    } else {
      this.selectedProviders = [];
    }

  }
  removeProviders(providerId) {
    //  console.log(providerId)
    this.selectedProviders.forEach((provider, index) => {
      if (provider.switchAccountId == providerId) this.selectedProviders.splice(index, 1);
    });
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