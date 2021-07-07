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

  thereIsActiveDownloads: boolean = false;
  downloads: DownloadRequest[] = [];

  @ViewChild('downloadMenuTriggerButton', { static: false, read: MatMenuTrigger }) downloadMenuRef: MatMenuTrigger;

  constructor(private commen: SharedServices, public router: Router, public authService: AuthService, private downloadService: DownloadService) {
    this.commen.unReadNotificationsCountChange.subscribe(count => {
      this.setNewNotificationIndecater(count > 0);
    });
    this.authService.isUserNameUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.getUserData();
        this.commen.getNotifications();
        this.commen.getUploadHistory();
        this.commen.getAnnouncements();
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
    return this.commen.loading;
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
    this.commen.showAnnouncementCenterChange.next(!this.commen.showAnnouncementCenter);
  }

  toggleNotificationCenter() {
    this.commen.showNotificationCenterChange.next(!this.commen.showNotificationCenter);
  }

  toggleUploadHistoryCenter() {
    this.commen.showUploadsCenterChange.next(!this.commen.showUploadsCenter);
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

}
