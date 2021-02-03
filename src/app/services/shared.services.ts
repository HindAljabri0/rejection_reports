import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClaimStatus } from '../models/claimStatus';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificationsService } from './notificationService/notifications.service';
import { AnnouncementsService } from './announcementService/announcements.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Notification } from '../models/notification';
import { Announcement } from '../models/announcement';
import { PaginatedResult } from '../models/paginatedResult';
import { AuthService } from './authService/authService.service';
import { UploadSummary } from '../models/uploadSummary';
import { UploadService } from './claimfileuploadservice/upload.service';
import { SearchService } from './serchService/search.service';

@Injectable({
  providedIn: 'root'
})
export class SharedServices {
  private payers: { id: number, name: string }[];
  payerids: number[];
  loading: boolean = false;
  loadingChanged: Subject<boolean> = new Subject<boolean>();

  searchIsOpen: boolean = false;
  searchIsOpenChange: Subject<boolean> = new Subject<boolean>();

  showNotificationCenter: boolean;
  showNotificationCenterChange: Subject<boolean> = new Subject();

  showAnnouncementCenter: boolean;
  showAnnouncementCenterChange: Subject<boolean> = new Subject();

  //unReadAnnouncementsCount: number = 0;
  //unReadAnnouncementsCountChange: Subject<number> = new Subject();
  announcementsCount: number = 0;
  announcementsCountChange: Subject<number> = new Subject();
  announcementsList: Announcement[];
  announcementsListChange: Subject<Announcement[]> = new Subject();

  showUploadHistoryCenter: boolean;
  showUploadHistoryCenterChange: Subject<boolean> = new Subject();

  showValidationDetailsTab = false;
  showValidationDetailsTabChange: Subject<boolean> = new Subject();

  unReadNotificationsCount: number = 0;
  unReadNotificationsCountChange: Subject<number> = new Subject();
  notificationsList: Notification[];
  notificationsListChange: Subject<Notification[]> = new Subject();

  uploadHistoryList: UploadSummary[];
  uploadHistoryListChange: Subject<UploadSummary[]> = new Subject();
  getUploadId: any;

  constructor(public authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private announcements: AnnouncementsService,
    private uploadService: UploadService,
    private searchService: SearchService
  ) {


    this.loadingChanged.subscribe((value) => {
      this.loading = value;
    });

    this.searchIsOpenChange.subscribe(value => {
      this.searchIsOpen = value;
    });
    this.showNotificationCenterChange.subscribe(value => {
      this.showNotificationCenter = value;
      if (value) {
        this.showUploadHistoryCenterChange.next(false);
        this.showAnnouncementCenterChange.next(false);
      }
    });
    this.unReadNotificationsCountChange.subscribe(value => {
      this.unReadNotificationsCount = value;
    });
    this.notificationsListChange.subscribe(value => {
      this.notificationsList = value;
    });
    this.showAnnouncementCenterChange.subscribe(value => {
      this.showAnnouncementCenter = value;
      if (value) {
        this.showUploadHistoryCenterChange.next(false);
        this.showNotificationCenterChange.next(false);
      }
    });
    this.showUploadHistoryCenterChange.subscribe(value => {
      this.showUploadHistoryCenter = value;
      if (value) {
        this.showNotificationCenterChange.next(false);
        this.showAnnouncementCenterChange.next(false);
      }
    });
    this.announcementsCountChange.subscribe(value => {
      this.announcementsCount = value;
    });
    this.announcementsListChange.subscribe(value => {
      this.announcementsList = value;
    });
    this.uploadHistoryListChange.subscribe(value => {
      this.uploadHistoryList = value.map(upload => {
        // upload.uploaddate = new Date(upload.uploaddate);
        return new UploadSummary(upload);
      });
    });
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getNotifications();
      this.getUploadHistory();
      this.getAnnouncements();
    });

    this.showValidationDetailsTabChange.subscribe((value) => {
      this.showValidationDetailsTab = value;
    });
  }

  getNotifications() {
    if (this.providerId == null) { return; }
    this.notifications.getNotificationsCount(this.providerId, 'unread').subscribe(event => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`);
        if (!Number.isNaN(count)) {
          this.unReadNotificationsCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadNotificationsCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
    this.notifications.getNotifications(this.providerId, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        const paginatedResult: PaginatedResult<Notification> = new PaginatedResult(event.body, Notification);
        this.notificationsListChange.next(paginatedResult.content);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadNotificationsCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  getAnnouncements() {
    if (this.providerId == null) { return; }
    this.payers = this.getPayersList();
    this.payerids = this.payers.map(item => item.id);
    this.announcements.getAnnouncementsCount(this.providerId, this.payerids).subscribe(event => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`);
        if (!Number.isNaN(count)) {
          this.announcementsCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.announcementsCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
    this.announcements.getAnnouncements(this.providerId, this.payerids, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        const paginatedResult: PaginatedResult<Announcement> = new PaginatedResult(event.body, Announcement);
        this.announcementsListChange.next(paginatedResult.content);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.announcementsCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  getUploadHistory() {
    if (this.providerId == null) return;

    this.searchService.getUploadSummaries(this.providerId, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.uploadHistoryListChange.next(event.body["content"]);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.uploadHistoryListChange.next([]);
      }
    });
  }

  markAsRead(notificationId: string, providerId: string) {
    this.notifications.markNotificationAsRead(providerId, notificationId).subscribe(event => {
      if (event instanceof HttpResponse) {
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent);
      }
    });
  }

  public get uploadId() {
    return this.getUploadId();
  }


  public get providerId() {
    return this.authService.getProviderId();
  }

  getCardAccentColor(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.Accepted.toLowerCase():
        return '#67CD23';
      case ClaimStatus.NotAccepted.toLowerCase():
        return '#FF144D';
      case ClaimStatus.ALL.toLowerCase():
        return '#3060AA';
      case '-':
        return '#bebebe';
      case ClaimStatus.REJECTED.toLowerCase():
        return '#FF53A3';
      case ClaimStatus.PAID.toLowerCase():
        return '#1C7C26';
      case ClaimStatus.PARTIALLY_PAID.toLowerCase(): case 'PARTIALLY_PAID'.toLowerCase():
        return '#479CC5';
      case ClaimStatus.OUTSTANDING.toLowerCase():
        return '#7D0202';
      case ClaimStatus.Batched.toLowerCase():
        return '#F3D34B';
      case ClaimStatus.Downloadable.toLowerCase():
        return '#67CD23';
      default:
        return '#E6AE24';
    }
  }

  statusToName(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.Accepted.toLowerCase():
        return 'Ready for Submission';
      case ClaimStatus.NotAccepted.toLowerCase():
        return 'Rejected by Waseel';
      case ClaimStatus.ALL.toLowerCase():
        return 'All Claims'
      case ClaimStatus.PARTIALLY_PAID.toLowerCase(): case 'PARTIALLY_PAID'.toLowerCase():
        return 'Partially Paid';
      case ClaimStatus.REJECTED.toLowerCase():
        return 'Rejected by Payer';
      case ClaimStatus.Batched.toLowerCase():
        return 'Under Submission';
      case ClaimStatus.OUTSTANDING.toLowerCase():
        return 'Under Processing';
      default:
        return status.substr(0, 1).toLocaleUpperCase() + status.substr(1).toLocaleLowerCase().replace('_', ' ');
    }
  }

  getPayersList(globMed?: boolean): { id: number, name: string, arName: string }[] {
    if (globMed == null) globMed = false;
    let payers: { id: number, name: string, arName: string }[] = [];
    const payersStr = localStorage.getItem('payers');
    if (payersStr != null) {
      const payersStrSplitted = payersStr.split('|');
      payersStrSplitted
        .filter(value =>
          (!globMed && value.split(':')[1].split(',')[3] != 'GlobeMed')
          || (globMed && value.split(':')[1].split(',')[3] == 'GlobeMed'))
        .map(value => payers.push({
          id: Number.parseInt(value.split(':')[0]),
          name: value.split(':')[1].split(',')[0],
          arName: value.split(':')[1].split(',')[1]
        }));
    }

    return payers;
  }

  getPayerCode(payerId: string) {
    switch (payerId) {
      case '204':
        return "AXA";
      case '301':
        return "ArabianSh";
      case '205':
        return "SAICO";
      case '201':
        return "Malath";
      case '207':
        return "Rajhi";
      case '203':
        return "GCI";
      case '202':
        return "SGI";
      case '200':
        return "CARS";
      case '300':
        return "MedGulf";
      case '102':
        return "NCCI";
      case '206':
        return "Weqaya";
      case '303':
        return "WeqayaSNC";
      case '302':
        return "ASF";
      case '209':
        return "Walaa";
      case '208':
        return "SAGR";
      case '305':
        return "SACB";
      case '306':
        return "ENAYA";
      case '307':
        return "EMIC";
      case '314':
        return "GlobMed";
      default:
        return "";
    }
  }

}
