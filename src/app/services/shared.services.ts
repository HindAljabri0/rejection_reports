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
  loading = false;
  loadingChanged: Subject<boolean> = new Subject<boolean>();

  searchIsOpen = false;
  searchIsOpenChange: Subject<boolean> = new Subject<boolean>();

  showNotificationCenter: boolean;
  showNotificationCenterChange: Subject<boolean> = new Subject();

  showAnnouncementCenter: boolean;
  showAnnouncementCenterChange: Subject<boolean> = new Subject();

  // unReadAnnouncementsCount: number = 0;
  // unReadAnnouncementsCountChange: Subject<number> = new Subject();
  announcementsCount = 0;
  announcementsCountChange: Subject<number> = new Subject();
  announcementsList: Announcement[];
  announcementsListChange: Subject<Announcement[]> = new Subject();

  showUploadHistoryCenter: boolean;
  showUploadHistoryCenterChange: Subject<boolean> = new Subject();

  unReadNotificationsCount = 0;
  unReadNotificationsCountChange: Subject<number> = new Subject();
  notificationsList: Notification[];
  notificationsListChange: Subject<Notification[]> = new Subject();

  uploadHistoryList: UploadSummary[];
  uploadHistoryListChange: Subject<UploadSummary[]> = new Subject();
  getUploadId: any;

  constructor(
    public authService: AuthService,
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
  }

  getNotifications() {
    if (this.providerId == null) { return; }
    this.notifications.getNotificationsCount(this.providerId, 'unread').subscribe(event => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
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
        const count = Number.parseInt(`${event.body}`, 10);
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
    if (this.providerId == null) {
      return;
    }

    this.searchService.getUploadSummaries(this.providerId, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.uploadHistoryListChange.next(event.body['content']);
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
        return 'ready-submission';
      case ClaimStatus.NotAccepted.toLowerCase():
        return 'rejected-waseel';
      case ClaimStatus.ALL.toLowerCase():
        return 'all-claim';
      case '-':
        return 'middle-grey';
      case ClaimStatus.REJECTED.toLowerCase():
        return 'rejected';
      case ClaimStatus.PAID.toLowerCase():
        return 'paid';
      case ClaimStatus.PARTIALLY_PAID.toLowerCase(): case 'PARTIALLY_PAID'.toLowerCase():
        return 'partially-paid';
      case ClaimStatus.OUTSTANDING.toLowerCase():
        return 'under-processing';
      case ClaimStatus.Batched.toLowerCase():
        return 'not-saved';
      case ClaimStatus.Downloadable.toLowerCase():
        return 'ready-submission';
      case ClaimStatus.INVALID.toLowerCase():
        return 'invalid';
      default:
        return 'not-saved';
    }
  }

  statusToName(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.Accepted.toLowerCase():
        return 'Ready for Submission';
      case ClaimStatus.NotAccepted.toLowerCase():
        return 'Rejected by Waseel';
      case ClaimStatus.ALL.toLowerCase():
        return 'All Claims';
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
    if (globMed == null) {
      globMed = false;
    }
    const payers: { id: number, name: string, arName: string }[] = [];
    const payersStr = localStorage.getItem('payers');
    if (payersStr != null) {
      const payersStrSplitted = payersStr.split('|');
      payersStrSplitted
        .filter(value =>
          (!globMed && value.split(':')[1].split(',')[3] != 'GlobeMed')
          || (globMed && value.split(':')[1].split(',')[3] == 'GlobeMed'))
        .map(value => payers.push({
          id: Number.parseInt(value.split(':')[0], 10),
          name: value.split(':')[1].split(',')[0],
          arName: value.split(':')[1].split(',')[1]
        }));
    }

    return payers;
  }

  getPayerCode(payerId: string) {
    switch (payerId) {
      case '204':
        return 'AXA';
      case '301':
        return 'ArabianSh';
      case '205':
        return 'SAICO';
      case '201':
        return 'Malath';
      case '207':
        return 'Rajhi';
      case '203':
        return 'GCI';
      case '202':
        return 'SGI';
      case '200':
        return 'CARS';
      case '300':
        return 'MedGulf';
      case '102':
        return 'NCCI';
      case '206':
        return 'Weqaya';
      case '303':
        return 'WeqayaSNC';
      case '302':
        return 'ASF';
      case '209':
        return 'Walaa';
      case '208':
        return 'SAGR';
      case '305':
        return 'SACB';
      case '306':
        return 'ENAYA';
      case '307':
        return 'EMIC';
      case '314':
        return 'GlobMed';
      default:
        return payerId;
    }
  }

  RGBToHSL(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    let s;
    const l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  HSLToRGB(h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
  }

  RGBToHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1) {
      r = '0' + r;
    }
    if (g.length == 1) {
      g = '0' + g;
    }
    if (b.length == 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }

  hexToRGB(h) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getAnalogousColor(count: number): string[] {
    const returnArray: string[] = new Array();
    const baseColor = '#3060AA';
    const baseColorRGB = this.hexToRGB(baseColor);
    const baseColorHSL = this.RGBToHSL(baseColorRGB.r, baseColorRGB.g, baseColorRGB.b);
    const hueSteps = 330 / count;
    let currentHueValue = 0;
    for (let i = 0; i < count; i++, currentHueValue += hueSteps) {
      let incrementedHue = baseColorHSL.h + currentHueValue;
      if (incrementedHue > 360) {
        incrementedHue %= 360;
      }
      const derivedHSL = { h: incrementedHue, s: baseColorHSL.s, l: baseColorHSL.l };
      const derivedRGB = this.HSLToRGB(derivedHSL.h, derivedHSL.s, derivedHSL.l);
      const derivedHex = this.RGBToHex(derivedRGB.r, derivedRGB.g, derivedRGB.b);
      returnArray.push(derivedHex);
    }
    return returnArray;
  }
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
