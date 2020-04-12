import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../components/dialogs/message-dialog/message-dialog.component';
import { ClaimStatus } from '../models/claimStatus';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificationsService } from './notificationService/notifications.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Notification } from '../models/notification';
import { PaginatedResult } from '../models/paginatedResult';
import { MessageDialogData } from '../models/dialogData/messageDialogData';
import { ViewedClaim } from '../models/viewedClaim';
import { SearchService } from './serchService/search.service';
import { ClaimDialogComponent } from '../components/dialogs/claim-dialog/claim-dialog.component';
import { AuthService } from './authService/authService.service';
import { PaymentClaimDetail } from '../models/paymentClaimDetail';
import { PaymentClaimDetailDailogComponent } from '../components/dialogs/payment-claim-detail-dailog/payment-claim-detail-dailog.component';
import { PaymentServiceDetails } from '../models/paymentServiceDetails';
import { ReportsService } from './reportsService/reports.service';
import { DialogService } from './dialogsService/dialog.service';
import { RejectionReportClaimDialogData } from '../models/dialogData/rejectionReportClaimDialogData';
import { UploadSummary } from '../models/uploadSummary';
import { UploadService } from './claimfileuploadservice/upload.service';

@Injectable({
  providedIn: 'root'
})
export class CommenServicesService {
  loading: boolean = false;
  loadingChanged: Subject<boolean> = new Subject<boolean>();

  searchIsOpen: boolean = false;
  searchIsOpenChange: Subject<boolean> = new Subject<boolean>();

  showNotificationCenter: boolean;
  showNotificationCenterChange: Subject<boolean> = new Subject();

  showUploadHistoryCenter: boolean;
  showUploadHistoryCenterChange: Subject<boolean> = new Subject();

  unReadNotificationsCount: number = 0;
  unReadNotificationsCountChange: Subject<number> = new Subject();
  notificationsList: Notification[];
  notificationsListChange: Subject<Notification[]> = new Subject();

  uploadHistoryList: UploadSummary[];
  uploadHistoryListChange: Subject<UploadSummary[]> = new Subject();


  constructor(public authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private uploadService: UploadService) {
    this.loadingChanged.subscribe((value) => {
      this.loading = value;
    });
    this.searchIsOpenChange.subscribe(value => {
      this.searchIsOpen = value;
    });
    this.showNotificationCenterChange.subscribe(value => {
      this.showNotificationCenter = value;
      if(value) this.showUploadHistoryCenterChange.next(false);
    });
    this.showUploadHistoryCenterChange.subscribe(value => {
      this.showUploadHistoryCenter = value;
      if(value) this.showNotificationCenterChange.next(false);
    });
    this.unReadNotificationsCountChange.subscribe(value => {
      this.unReadNotificationsCount = value;
    });
    this.notificationsListChange.subscribe(value => {
      this.notificationsList = value;
    });
    this.uploadHistoryListChange.subscribe(value => {
      this.uploadHistoryList = value.map(upload => {
        upload.uploadDate = new Date(upload.uploadDate);
        return upload;
      });
    });
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getNotifications();
      this.getUploadHistory();
    });
  }

  getNotifications() {
    if (this.providerId == null) return;
    this.notifications.getNotificationsCount(this.providerId, 'unread').subscribe(event => {
      if (event instanceof HttpResponse) {
        const count = Number.parseInt(`${event.body}`);
        if (!Number.isNaN(count))
          this.unReadNotificationsCountChange.next(count);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadNotificationsCountChange.next(errorEvent.status == 0 ? -1 : (errorEvent.status * -1));
      }
    });
    this.notifications.getNotifications(this.providerId, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        const paginatedResult: PaginatedResult<Notification> = new PaginatedResult(event.body, Notification);
        this.notificationsListChange.next(paginatedResult.content);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.unReadNotificationsCountChange.next(errorEvent.status == 0 ? -1 : (errorEvent.status * -1));
      }
    });
  }

  getUploadHistory() {
    if (this.providerId == null) return;
    
    this.uploadService.getUploadSummaries(this.providerId, 0, 10).subscribe(event => {
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
        console.log(event);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent);
      }
    });
  }




  public get providerId() {
    return this.authService.getProviderId();
  }

  getCardAccentColor(status: string) {
    switch (status.toLowerCase()) {
      case ClaimStatus.Accepted.toLowerCase():
        return '#21B744';
      case ClaimStatus.NotAccepted.toLowerCase():
        return '#EB2A75';
      case ClaimStatus.ALL.toLowerCase():
        return '#3060AA';
      case '-':
        return '#bebebe';
      case ClaimStatus.REJECTED.toLowerCase():
        return '#E988AD';
      default:
        return '#E3A820';
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
      default:
        return status.substr(0, 1).toLocaleUpperCase() + status.substr(1).toLocaleLowerCase().replace('_', ' ');
    }
  }

  getPayersList():{id:number, name:string, arName:string}[]{
    let payers:{id:number, name:string, arName:string}[] = [];
    const payersStr = localStorage.getItem('payers');
    if(payersStr != null){
      const payersStrSplitted = payersStr.split('|');
      payersStrSplitted.map(value => payers.push({
        id: Number.parseInt(value.split(':')[0]),
        name:value.split(':')[1].split(',')[0],
        arName: value.split(':')[1].split(',')[1]
      }));
    }

    return payers;
  }

}
