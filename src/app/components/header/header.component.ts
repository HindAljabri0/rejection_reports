import { Component, OnInit, Input } from '@angular/core';
import { SharedServices } from '../../services/shared.services';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  userName: string;
  providerName: string;

  @Input() activeLanguageLabel: string;

  @Input() languageList;

  notificationIconClasses = "mat-icon-button mat-button-base ";

  constructor(private commen: SharedServices, public router: Router, public authService: AuthService) {
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
  }

  get loading(): boolean {
    return this.commen.loading;
  }

  ngOnInit() {
    this.getUserData();

  }

  setNewNotificationIndecater(show: boolean) {
    if (show) {
      this.notificationIconClasses = "mat-icon-button mat-button-base hasNotifications";
    } else {
      this.notificationIconClasses = "mat-icon-button mat-button-base ";
    }
  }

  toggleAnnouncementCenter() {
    this.commen.showAnnouncementCenterChange.next(!this.commen.showAnnouncementCenter);
  }

  toggleNotificationCenter() {
    this.commen.showNotificationCenterChange.next(!this.commen.showNotificationCenter);
  }

  toggleUploadHistoryCenter(){
    this.commen.showUploadHistoryCenterChange.next(!this.commen.showUploadHistoryCenter);
  }

  logout() {
    this.authService.logout();
  }

}
