import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedServices } from '../../services/shared.services';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadRequest } from 'src/app/models/downloadRequest';
import { MatMenuTrigger } from '@angular/material';

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

  @ViewChild('downloadMenuTriggerButton', { static: false, read: MatMenuTrigger }) downloadMenuRef: MatMenuTrigger;

  constructor(
    private sharedServices: SharedServices,
    public router: Router,
    public authService: AuthService,
    private downloadService: DownloadService
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
    this.getUserData();
    this.downloadService.downloads.subscribe(downloads => {
      this.downloads = downloads;
      this.thereIsActiveDownloads = downloads.length > 0;
      setTimeout(() => this.downloadMenuRef.openMenu(), 500);
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

  get isProvider() {
    return this.sharedServices.isProvider;
  }

}
