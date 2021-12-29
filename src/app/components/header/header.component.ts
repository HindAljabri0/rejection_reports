import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedServices } from '../../services/shared.services';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadRequest, DownloadStatus } from 'src/app/models/downloadRequest';
import { MatMenuTrigger } from '@angular/material';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

declare function initFreshChat(): any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  userName: string;
  providerName: string;
  providerId: string;

  @Input() activeLanguageLabel: string;

  @Input() languageList;

  notificationIconClasses = 'mat-icon-button mat-button-base ';

  thereIsActiveDownloads = false;
  downloads: DownloadRequest[] = [];
  watchingProcessed = false;
  showWhatsAppSupport = false;

  @ViewChild('downloadMenuTriggerButton', { static: false, read: MatMenuTrigger }) downloadMenuRef: MatMenuTrigger;

  constructor(
    private sharedServices: SharedServices,
    private renderer: Renderer2,
    public router: Router,
    public authService: AuthService,
    private downloadService: DownloadService,
    private notificationService: NotificationsService,
    private reportsService: ReportsService
  ) {
    this.sharedServices.unReadNotificationsCountChange.subscribe(count => {
      this.setNewNotificationIndecater(count > 0);
    });
    this.authService.isUserNameUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.getUserData();
        this.sharedServices.getNotifications();
        this.sharedServices.getUploads();
        this.sharedServices.getAnnouncements();
      }
    }
    );
  }

  getUserData() {
    this.userName = this.authService.getUserName();
    this.providerName = this.authService.getProviderName();
    this.providerId = this.authService.getProviderId();
  }

  get loading(): boolean {
    return this.sharedServices.loading;
  }

  ngOnInit() {

    if (environment.showFreshChat) {
      this.showWhatsAppSupport = true;
      this.showFreshChatBox();
    }

    this.getUserData();

    this.sharedServices.getProcessedCount();
    this.sharedServices.getCommunicationRequestCount();

    this.watchPreAuthorizationChanges();


    this.downloadService.downloads.subscribe(downloads => {
      this.downloads = []
      this.downloads = downloads;
      this.thereIsActiveDownloads = downloads.length > 0;
      setTimeout(() => this.downloadMenuRef.openMenu(), 500);
    });

    this.reportsService.getAllDownloadsForProvider(this.providerId, null, null).subscribe(downloads => {
      this.downloads = []
      if (downloads instanceof HttpResponse) {

        this.downloads = downloads.body['content'] as DownloadRequest[];
        this.thereIsActiveDownloads = this.downloads.length > 0;

      }
    });


  }

  setNewNotificationIndecater(show: boolean) {
    if (show) {
      this.notificationIconClasses = 'mat-icon-button mat-button-base hasNotifications';
    } else {
      this.notificationIconClasses = 'mat-icon-button mat-button-base ';
    }
  }

  toggleAnnouncementCenter() {
    this.sharedServices.showAnnouncementCenterChange.next(!this.sharedServices.showAnnouncementCenter);
  }

  toggleNotificationCenter() {
    this.sharedServices.showNotificationCenterChange.next(!this.sharedServices.showNotificationCenter);
  }

  toggleUploadHistoryCenter() {
    this.sharedServices.showUploadsCenterChange.next(!this.sharedServices.showUploadsCenter);
  }

  logout() {
    this.authService.logout();
  }

  toggleSearch() {
    document.body.classList.toggle('search-visible');
  }

  toggleNav() {
    document.body.classList.toggle('nav-open');
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }

  watchPreAuthorizationChanges() {
    if (this.watchingProcessed) { return; }

    this.watchingProcessed = true;

    this.notificationService.startWatchingMessages(this.sharedServices.providerId, 'nphies');
    this.notificationService._messageWatchSources['nphies'].subscribe(value => {

      value = value.replace(`"`, '').replace(`"`, '');
      const splitedValue: string[] = value.split(':');

      if (splitedValue[0] === 'approval-notifications') {
        this.sharedServices.getProcessedCount();
        // const model: any = {};
        // // tslint:disable-next-line:radix
        // model.notificationId = parseInt(splitedValue[2]);
        // // tslint:disable-next-line:radix
        // model.responseId = parseInt(splitedValue[1]);
        // this.sharedServices.addProcessedNotifications(model);
      }

      if (splitedValue[0] === 'communication-request-notification') {
        this.sharedServices.getCommunicationRequestCount();
        // const model: any = {};
        // // tslint:disable-next-line:radix
        // model.notificationId = parseInt(splitedValue[2]);
        // // tslint:disable-next-line:radix
        // model.communicationId = parseInt(splitedValue[1]);
        // this.sharedServices.addCommunicationRequestNotifications(model);
      }

    });
  }


  showFreshChatBox() {
    window['fcWidget'].init({
      token: '32afa4a2-e443-4a99-aa8b-67e3a6639fd2',
      host: 'https://wchat.freshchat.com'
    });
  }

  get isProvider() {
    return this.sharedServices.isProvider;
  }

}
