import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClaimStatus } from '../models/claimStatus';
import { Router } from '@angular/router';
import { NotificationsService } from './notificationService/notifications.service';
import { AnnouncementsService } from './announcementService/announcements.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Notification } from '../models/notification';
import { Announcement } from '../models/announcement';
import { PaginatedResult } from '../models/paginatedResult';
import { AuthService } from './authService/authService.service';
import { SearchService } from './serchService/search.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { getUserPrivileges, initState, UserPrivileges } from '../store/mainStore.reducer';
import { ProviderNphiesSearchService } from './providerNphiesSearchService/provider-nphies-search.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SharedServices {
  private payers: { id: number, name: string }[] = [];
  payerids: number[] = [];
  loading = false;
  loadingChanged: Subject<boolean> = new Subject<boolean>();
  searchIsOpen = false;
  searchIsOpenChange: Subject<boolean> = new Subject<boolean>();

  showNotificationCenter: boolean;
  showNotificationCenterChange: Subject<boolean> = new Subject();

  showAnnouncementCenter: boolean;
  showAnnouncementCenterChange: Subject<boolean> = new Subject();

  announcementsCount = 0;
  announcementsCountChange: Subject<number> = new Subject();
  announcementsList: Announcement[];
  announcementsListChange: Subject<Announcement[]> = new Subject();

  showUploadsCenter: boolean;
  showUploadsCenterChange: Subject<boolean> = new Subject();

  unReadNotificationsCount = 0;
  unReadNotificationsCountChange: Subject<number> = new Subject();
  notificationsList: Notification[];
  notificationsListChange: Subject<Notification[]> = new Subject();

  unReadProcessedCount = 0;
  unReadProcessedCountChange: Subject<number> = new Subject();
  
  unReadProcessedApaCount = 0;
  unReadProcessedApaCountChange: Subject<number> = new Subject();

  unReadComunicationRequestCount = 0;
  unReadComunicationRequestCountChange: Subject<number> = new Subject();

  unReadApaComunicationRequestCount = 0;
  unReadApaComunicationRequestCountChange: Subject<number> = new Subject();

  unReadRecentCount = 0;
  unReadRecentCountChange: Subject<number> = new Subject();

  unReadClaimProcessedCount = 0;
  unReadClaimProcessedCountChange: Subject<number> = new Subject();

  unReadClaimComunicationRequestCount = 0;
  unReadClaimComunicationRequestCountChange: Subject<number> = new Subject();

  uploadsList: {
    totalClaims: number,
    uploadDate: Date,
    uploadId: number,
    uploadName: string
  }[];
  uploadsListChange: Subject<{
    totalClaims: number,
    uploadDate: Date,
    uploadId: number,
    uploadName: string
  }[]> = new Subject();
  uploadsListLoading: boolean = false;
  uploadsListLoadingChange: Subject<boolean> = new Subject();

  userPrivileges: UserPrivileges = initState.userPrivileges;

  getUploadId: any;
  helper = new JwtHelperService();

  shadesOfDangerColor = ['#faeded', '#f0c8c8', '#e6a4a4', '#dc8080', '#d25b5b', '#b94242', '#903333', '#672525', '#3d1616', '#140707'];
  shadesOfSuccessColor = ['#eef9ed', '#cdecca', '#ace0a7', '#8bd484', '#6ac761', '#50ae47', '#3e8737', '#2d6128', '#1b3a18', '#091308'];
  constructor(
    public authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private announcements: AnnouncementsService,
    private searchService: SearchService,
    private store: Store,
    private datePipe: DatePipe,
    private providerNphiesSearchService: ProviderNphiesSearchService
  ) {


    this.loadingChanged.subscribe((value) => {
      this.loading = value;
    });

    this.uploadsListLoadingChange.subscribe((value) => {
      this.uploadsListLoading = value;
    });

    this.searchIsOpenChange.subscribe(value => {
      this.searchIsOpen = value;
    });
    this.showNotificationCenterChange.subscribe(value => {
      this.showNotificationCenter = value;
      if (value) {
        this.getNotifications();
        this.showUploadsCenterChange.next(false);
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
        this.getAnnouncements();
        this.showUploadsCenterChange.next(false);
        this.showNotificationCenterChange.next(false);
      }
    });
    this.showUploadsCenterChange.subscribe(value => {
      this.showUploadsCenter = value;
      if (value) {
        this.getUploads();
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
    this.uploadsListChange.subscribe(value => {
      this.uploadsList = value.map(upload => {
        return {
          totalClaims: upload.totalClaims, uploadDate: upload.uploadDate, uploadId: upload.uploadId, uploadName: upload.uploadName
        };
      });
    });

    this.getNotifications();

    this.unReadProcessedCountChange.subscribe(value => {
      this.unReadProcessedCount = value;
    });
    this.unReadComunicationRequestCountChange.subscribe(value => {
      this.unReadComunicationRequestCount = value;
    });
    this.unReadApaComunicationRequestCountChange.subscribe(value => {
      this.unReadApaComunicationRequestCount = value;
    });
    this.unReadRecentCountChange.subscribe(value => {
      this.unReadRecentCount = value;
    });
    this.unReadClaimProcessedCountChange.subscribe(value => {
      this.unReadClaimProcessedCount = value;
    });
    this.unReadClaimComunicationRequestCountChange.subscribe(value => {
      this.unReadClaimComunicationRequestCount = value;
    });
    this.store.select(getUserPrivileges).subscribe(privileges => this.userPrivileges = privileges);

  }

  getNotifications() {    

    if (!this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isClaimUser) { return; }
    this.notifications.getNotificationsCount(this.providerId, 'batch-summary-inquiry', 'unread').subscribe(event => {
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

    this.notifications.getNotifications(this.providerId, 'batch-summary-inquiry', 0, 10).subscribe(event => {
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
    if (!this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isClaimUser) { return; }
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

  getUploads() {
    if (!this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isClaimUser && !this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isAdmin) { return; }
    this.uploadsListLoadingChange.next(true);
    this.searchService.getUploadSummaries(this.providerId, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.uploadsListChange.next(event.body['content']);
        this.uploadsListLoadingChange.next(false);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.uploadsListChange.next([]);
      }
      this.uploadsListLoadingChange.next(false);
    });
  }

  getProcessedCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'approval-notifications', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadProcessedCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadProcessedCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }
  getProcessedApaCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'advanced-approval-notifications', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadProcessedApaCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadProcessedApaCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  getCommunicationRequestCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'approval-communication-request-notification', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadComunicationRequestCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadComunicationRequestCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }
  getApaCommunicationRequestCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'advance-approval-communication-request-notification', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadApaComunicationRequestCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadApaComunicationRequestCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  getRecentReconciliationCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'payment-reconciliation-notification', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadRecentCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadRecentCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  isOverNphiesdwonTime() {
    console.log(this.router.url)
    var dateOftoday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log("dateOftoday : " + dateOftoday);
    var overDate = this.datePipe.transform("2022-09-25", 'yyyy-MM-dd');

    console.log("overDate : " + overDate);
    //dateOftoday >= overDate &&
    return dateOftoday >= overDate;
  }

  isHasNphiesPrivileges() {
    return this.userPrivileges.ProviderPrivileges.NPHIES.canAccessPreAuthorization || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessClaim ||
      this.userPrivileges.ProviderPrivileges.NPHIES.canAccessEligibility || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessPhysician || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessPriceList || this.userPrivileges.ProviderPrivileges.NPHIES.isAdmin || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessBeneficiary || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessPaymentReconciliation;
  }

  getClaimProcessedCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'claim-notifications', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadClaimProcessedCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadClaimProcessedCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  getClaimCommunicationRequestCount() {
    // tslint:disable-next-line:max-line-length
    this.notifications.getNotificationsCountByWeek(this.providerId, 'claim-communication-request-notification', 'unread').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`, 10);
        if (!Number.isNaN(count)) {
          this.unReadClaimComunicationRequestCountChange.next(count);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadClaimComunicationRequestCountChange.next(errorEvent.status === 0 ? -1 : (errorEvent.status * -1));
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

  markAllAsRead(providerId: string, notificationType: string) {
    this.notifications.markAllNotificationAsRead(providerId, notificationType).subscribe(event => {
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

  public get providerGroupId() {
    return this.authService.getOrganizationId();
  }

  provider(): String {
    return this.authService.getProviderId();
  }

  public get cchiId() {
    // tslint:disable-next-line:radix
    return parseInt(this.authService.getCCHIId());
  }

  getItemRowAccentColor(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.ALL.toLowerCase():
        return 'all-claim';
      case ClaimStatus.REJECTED.toLowerCase():
        return 'danger';
      case ClaimStatus.APPROVED.toLowerCase():
        return 'success';
      case ClaimStatus.PARTIAL.toLowerCase():
        return 'light-blue';
      default:
        return 'not-saved';
    }
  }

  getCardAccentColor(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.Accepted.toLowerCase():
        return 'ready-submission';
      case ClaimStatus.NotAccepted.toLowerCase():
        return 'rejected-waseel';
      case ClaimStatus.Error.toLowerCase():
        return 'rejected';
      case ClaimStatus.ALL.toLowerCase():
        return 'all-claim';
      case '-':
        return 'middle-grey';
      case ClaimStatus.REJECTED.toLowerCase():
        return 'rejected';
      case ClaimStatus.PAID.toLowerCase(): case ClaimStatus.APPROVED.toLowerCase():
        return 'paid';
      case ClaimStatus.PARTIALLY_PAID.toLowerCase(): case 'PARTIALLY_PAID'.toLowerCase():
      case ClaimStatus.PARTIALLY_APPROVED.toLowerCase():
      case ClaimStatus.PARTIAL.toLowerCase():
        return 'partially-paid';
      case ClaimStatus.OUTSTANDING.toLowerCase(): case ClaimStatus.Pended.toLowerCase():
        return 'under-processing';
      case ClaimStatus.Submitted.toLowerCase():
        return 'submitted';
      case ClaimStatus.SUBMITTED_OUTSIDE_WASEEL.toLowerCase():
        return 'submitted-outside-waseel';
      case ClaimStatus.Batched.toLowerCase():
        return 'not-saved';
      case ClaimStatus.Downloadable.toLowerCase():
        return 'downloadable';
      case ClaimStatus.INVALID.toLowerCase():
        return 'invalid';
      case ClaimStatus.DUPLICATE.toLowerCase():
        return 'duplicate';
      case ClaimStatus.CANCELLED.toLowerCase():
        return 'cancelled';
      case ClaimStatus.Queued.toLowerCase():
        return 'under-submission';
      default:
        return 'not-saved';
    }
  }

  statusToName(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.Accepted.toLowerCase():
        return 'Ready for Submission';
      case ClaimStatus.NotAccepted.toLowerCase():
        return 'Validation Errors';
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
      case ClaimStatus.SUBMITTED_OUTSIDE_WASEEL.toLowerCase():
        return 'Submitted Outside Waseel';
      case ClaimStatus.TOTALNOTSUBMITTED.toLowerCase():
        return 'Total Not Submitted';
      case ClaimStatus.TOTALSUBMITTED.toLowerCase():
        return 'Total Submitted';
      case ClaimStatus.Queued.toLowerCase():
        return 'Queued By NPHIES';
      case ClaimStatus.Error.toLowerCase():
        // return 'Invalid';
        return 'Rejected By NPHIES';
      case ClaimStatus.CANCELLED.toLowerCase():
        // return 'Invalid';
        return 'Cancelled';
      case ClaimStatus.FAILEDNPHIES.toLowerCase():
        return 'Failed By NPHIES';
      case ClaimStatus.PARTIAL.toLowerCase():
        return 'Partially Approved';
      case ClaimStatus.CREATINGATTACHMENT.toLowerCase():
        return 'Creating Attachment';
      case ClaimStatus.UNDER_PBM_VALIDATION.toLowerCase():
        return 'Under PBM Validation';
      case ClaimStatus.Under_Attachment_Linking.toLowerCase():
          return 'Linking Attachments';
      default:
        return status.substr(0, 1).toLocaleUpperCase() + status.substr(1).toLocaleLowerCase().replace('_', ' ');
    }
  }

  getPayersList(globMed?: boolean): { id: number, name: string, arName: string, payerCategory: string }[] {
    return AuthService.getPayersList(globMed);
  }

  get hasAnyNphiesPrivilege() {
    const keys = Object.keys(this.userPrivileges.ProviderPrivileges.NPHIES);
    return keys.some(key => this.userPrivileges.ProviderPrivileges.NPHIES[key]);
  }


  getPayersListWithoutTPA(globMed?: boolean): { id: number, name: string, arName: string, payerCategory: string }[] {

    const tpaList = this.getTPAsList();

    if (globMed == null) {
      globMed = false;
    }
    const payers: { id: number, name: string, arName: string, payerCategory: string }[] = [];
    const payersStr = localStorage.getItem('payers');
    if (payersStr != null && payersStr.trim().length > 0 && payersStr.includes('|')) {
      const payersStrSplitted = payersStr.split('|');
      payersStrSplitted
        // As globemed is not integrated with us so comment this below lines
        // .filter(value =>
        //   (!globMed && value.split(':')[1].split(',')[3] != 'GlobeMed')
        //   || (globMed && value.split(':')[1].split(',')[3] == 'GlobeMed'))
        .map(value => {
          // tslint:disable-next-line:max-line-length
          if (value.split(':')[1].split(',')[3] && tpaList.filter(x => x.name.toLowerCase() === value.split(':')[1].split(',')[3].toLowerCase()).length === 0) {
            payers.push({
              id: Number.parseInt(value.split(':')[0], 10),
              name: value.split(':')[1].split(',')[0],
              arName: value.split(':')[1].split(',')[1],
              payerCategory: value.split(':')[1].split(',')[2]
            });
          }
        }
        );
    } else if (payersStr != null && payersStr.trim().length > 0 && payersStr.includes(':')) {
      return [{
        id: Number.parseInt(payersStr.split(':')[0], 10),
        name: payersStr.split(':')[1].split(',')[0],
        arName: payersStr.split(':')[1].split(',')[1],
        payerCategory: payersStr.split(':')[1].split(',')[2]
      }];
    }

    return payers;
  }

  getTPAsList() {
    let tpas: { id: number, name: string }[] = [];
    const payersStr = localStorage.getItem('payers');
    if (payersStr != null && payersStr.trim().length > 0 && payersStr.includes('|')) {
      const payersStrSplitted = payersStr.split('|');
      tpas = payersStrSplitted
        .map(value => ({ id: Number.parseInt(value.split(',')[4]), name: value.split(',')[3] }));
    } else if (payersStr != null && payersStr.trim().length > 0 && payersStr.includes(':')) {
      tpas = [{ id: Number.parseInt(payersStr.split(',')[4]), name: payersStr.split(',')[3] }];
    }
    let distinctTPAIds: number[] = [];
    return tpas.filter(tpa => tpa.id != 1 && tpa.id != 2 && tpa.id != 94)
      .filter(tpa => {
        if (distinctTPAIds.includes(tpa.id)) {
          return false;
        } else {
          distinctTPAIds.push(tpa.id);
          return true;
        }
      });
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
      const derivedHSL = { h: incrementedHue, s: baseColorHSL.s, l: 55 };
      const derivedRGB = this.HSLToRGB(derivedHSL.h, derivedHSL.s, derivedHSL.l);
      returnArray.push(`rgba(${derivedRGB.r},${derivedRGB.g},${derivedRGB.b},1)`);
    }
    return returnArray;
  }
  getMonoToneColor(count: number): string[] {
    const returnArray: string[] = new Array();
    const baseColor = '#3060AA';
    const baseColorRGB = this.hexToRGB(baseColor);
    const baseColorHSL = this.RGBToHSL(baseColorRGB.r, baseColorRGB.g, baseColorRGB.b);
    const lightStep = (baseColorHSL.l - 5) / count;
    let currentLightValue = 0;
    for (let i = 0; i < count; i++, currentLightValue += lightStep) {
      const incrementLight = baseColorHSL.l + currentLightValue;
      const derivedHSL = { h: baseColorHSL.h, s: baseColorHSL.s, l: incrementLight };
      const derivedRGB = this.HSLToRGB(derivedHSL.h, derivedHSL.s, derivedHSL.l);
      returnArray.push(`rgba(${derivedRGB.r},${derivedRGB.g},${derivedRGB.b},1)`);
    }
    return returnArray;
  }
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  abbreviateNumber(value) {
    let newValue = value;
    if (value >= 1000) {
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      const suffixNum = Math.floor(('' + value).length / 3);
      let shortValue: any = '';
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
        const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
        if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 != 0) {
        shortValue = shortValue.toFixed(1);
      }
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }

  kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (((Math.abs(num) / 1000).toFixed(1)) as any) + 'k'
      : parseFloat((Math.sign(num) * Math.abs(num)).toFixed(2));
  }
  dataURItoBlob(dataURI, type) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf' });
    return blob;
  }
  decodeJwtToken(tkn: string, name: string): string {
    if (tkn) {
      const token = this.helper.decodeToken(tkn);
      return token[name];
    } else {
      return '';
    }
  }

  _base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  getColorsFromShades(numberOfColors: number, shade: string) {
    let colorGroup: string[];
    if (shade === 'danger') {
      colorGroup = this.shadesOfDangerColor;
    } else if (shade === 'success') {
      colorGroup = this.shadesOfSuccessColor;
    }
    if (numberOfColors > colorGroup.length) {
      return this.getAnalogousColor(numberOfColors);
    } else if (numberOfColors === colorGroup.length) {
      return colorGroup;
    } else {
      let startPosition = (colorGroup.length / 2) - (numberOfColors / 2);
      startPosition = (Number.isInteger(startPosition)) ? startPosition : Math.trunc(startPosition);
      return colorGroup.slice(startPosition, startPosition + numberOfColors);
    }
  }
}

export const SEARCH_TAB_RESULTS_KEY = 'search_tab_result';
export const NPIHES_CLAIM_PROVIDER_ID = 'nphies_claim_provider_id';
export const NPHIES_SEARCH_TAB_RESULTS_KEY = 'nphies_search_tab_result';
export const NPHIES_PROVIDER_ID_KEYS = 'nphies_provider_id_keys';
export const NPHIES_CURRENT_INDEX_KEY = 'CURRENT_PAGE_INDEX';
export const NPHIES_CURRENT_SEARCH_PARAMS_KEY = 'NPHIES_CURRENT_SEARCH_PARAMS';
