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
import { SearchServiceService } from './serchService/search-service.service';
import { ClaimDialogComponent } from '../components/dialogs/claim-dialog/claim-dialog.component';
import { AuthService } from './authService/authService.service';
import { PaymentClaimDetail } from '../models/paymentClaimDetail';
import { PaymentClaimDetailDailogComponent } from '../components/dialogs/payment-claim-detail-dailog/payment-claim-detail-dailog.component';
import { PaymentServiceDetails } from '../models/paymentServiceDetails';
import { ReportsService } from './reportsService/reports.service';
import { DialogService } from './dialogsService/dialog.service';
import { RejectionReportClaimDialogData } from '../models/dialogData/rejectionReportClaimDialogData';

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

  unReadNotificationsCount: number = 0;
  unReadNotificationsCountChange: Subject<number> = new Subject();
  notificationsList: Notification[];
  notificationsListChange: Subject<Notification[]> = new Subject();


  constructor(public authService: AuthService,
    private router: Router,
    private notifications: NotificationsService) {
    this.loadingChanged.subscribe((value) => {
      this.loading = value;
    });
    this.searchIsOpenChange.subscribe(value => {
      this.searchIsOpen = value;
    });
    this.showNotificationCenterChange.subscribe(value => {
      this.showNotificationCenter = value;
    });
    this.unReadNotificationsCountChange.subscribe(value => {
      this.unReadNotificationsCount = value;
    });
    this.notificationsListChange.subscribe(value => {
      this.notificationsList = value;
    });
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getNotifications();
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
    switch (status) {
      case ClaimStatus.Accepted:
        return '#21B744';
      case ClaimStatus.NotAccepted:
        return '#EB2A75';
      case ClaimStatus.ALL:
        return '#3060AA'
      case '-':
        return '#bebebe';
      // case ClaimStatus.Batched:
      //   return '#21b590';
      case ClaimStatus.INVALID:
        return '#E988AD';
      case ClaimStatus.Failed:
        return '#bf1958';
      default:
        return '#E3A820';
    }
  }

  statusToName(status: string) {
    switch (status) {
      case ClaimStatus.Accepted:
        return 'Ready for Submission';
      case ClaimStatus.NotAccepted:
        return 'Rejected by Waseel';
      case ClaimStatus.ALL:
        return 'All Claims'
      // case ClaimStatus.Batched:
      //   return 'Queued for Submission';
      case ClaimStatus.INVALID:
        return 'Rejected by Payer';
      case ClaimStatus.Failed:
        return 'Failed to Submit'
      case ClaimStatus.PARTIALLY_PAID:
        return 'Partially Paid';
      case ClaimStatus.REJECTED:
        return 'Rejected by Payer';
      default:
        return status.substr(0, 1).toLocaleUpperCase() + status.substr(1).toLocaleLowerCase();
    }
  }

}
