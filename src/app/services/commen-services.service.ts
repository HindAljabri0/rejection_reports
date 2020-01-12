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

@Injectable({
  providedIn: 'root'
})
export class CommenServicesService {
  loading:boolean = false;
  loadingChanged:Subject<boolean> = new Subject<boolean>();

  searchIsOpen:boolean = false;
  searchIsOpenChange:Subject<boolean> = new Subject<boolean>();

  showNotificationCenter:boolean;
  showNotificationCenterChange:Subject<boolean> = new Subject();

  unReadNotificationsCount:number = 0;
  unReadNotificationsCountChange: Subject<number> = new Subject();
  notificationsList:Notification[];
  notificationsListChange:Subject<Notification[]> = new Subject();

  onClaimDialogClose:Subject<any> = new Subject;
  
  constructor(private reportService:ReportsService, public authService:AuthService, public dialog:MatDialog, private router:Router, private notifications:NotificationsService, private search:SearchServiceService) {
    this.loadingChanged.subscribe((value)=>{
      this.loading = value;
    });
    this.searchIsOpenChange.subscribe(value =>{
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

  getNotifications(){
    if(this.providerId == null) return;
    this.notifications.getNotificationsCount(this.providerId, 'unread').subscribe(event => {
      if(event instanceof HttpResponse){
        const count = Number.parseInt(`${event.body}`);
        if(!Number.isNaN(count))
          this.unReadNotificationsCountChange.next(count);
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        this.unReadNotificationsCountChange.next(errorEvent.status == 0? -1 : (errorEvent.status*-1));
      }
    });
    this.notifications.getNotifications(this.providerId, 0, 10).subscribe(event => {
      if(event instanceof HttpResponse){
        const paginatedResult:PaginatedResult<Notification> = new PaginatedResult(event.body, Notification);
        this.notificationsListChange.next(paginatedResult.content);
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        this.unReadNotificationsCountChange.next(errorEvent.status == 0? -1 : (errorEvent.status*-1));
      }
    });
  }

  markAsRead(notificationId:string, providerId:string){
    this.notifications.markNotificationAsRead(providerId, notificationId).subscribe(event => {
      if(event instanceof HttpResponse){
        console.log(event);
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        console.log(errorEvent);
      }
    });
  }

  openDialog(dialogData:MessageDialogData):Observable<any>{
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '35%',
      height: '17%',
      panelClass: dialogData.isError? 'dialogError':'dialogSuccess',
      data: dialogData,
    });
    return dialogRef.afterClosed();
  }

  getClaimAndViewIt(providerId:string, payerId:string, status:string, claimId:string){
    if(this.loading) return;
    this.loadingChanged.next(true);
    this.getClaim(providerId, claimId).subscribe(event => {
      if(event instanceof HttpResponse){
        const claim:ViewedClaim = JSON.parse(JSON.stringify(event.body));
        this.loadingChanged.next(false);
        if(payerId==null)
        {
          payerId = claim.payerid;
        }
        this.openClaimDialog(providerId, payerId, status, claim);
      }      
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        if(errorEvent.status == 404){
          this.openDialog(new MessageDialogData("", 'Claim was not found!', true));
        } else {
          this.openDialog(new MessageDialogData("", 'Could not reach the server at the moment. Please try again later.', true));
        }
      }
      this.loadingChanged.next(false);
    });
  }

  getClaim(providerId:string, claimId:string){
    return this.search.getClaim(providerId, claimId);
  }

  public get providerId(){
    return this.authService.getProviderId();
  }

  openClaimDialog(providerId:string, payerId:string, status:string, claim:ViewedClaim){
    claim.providerId = providerId;
    claim.payerid = payerId;
    claim.status = status;
    const dialogRef = this.dialog.open(ClaimDialogComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'claimDialog',
      data: claim,
    });
    dialogRef.afterClosed().subscribe(value =>{
      this.onClaimDialogClose.next(value);
    });
  }

  getPaymentClaimDetailAndViewIt(claimId: number){
    this.reportService.getPaymentClaimDetail(this.providerId, claimId).subscribe(event =>{
      if(event instanceof HttpResponse){
        const claim:PaymentClaimDetail = JSON.parse(JSON.stringify(event.body));
        this.openPaymentClaimDetailDialog(claim);
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        this.openDialog(new MessageDialogData("", errorEvent.message, true));
      }
    });
  }
  openPaymentClaimDetailDialog(claim:PaymentClaimDetail){
    const dialogRef = this.dialog.open(PaymentClaimDetailDailogComponent, {
      width: '80%',
      height: '90%',
      panelClass: 'claimDialog',
      data: claim,
    });
    dialogRef.afterClosed().subscribe(value =>{
      this.onClaimDialogClose.next(value);
    });
  }

  getCardAccentColor(status:string){
    switch(status){
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

  statusToName(status:string){
    switch(status){
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
        return status.substr(0,1).toLocaleUpperCase() + status.substr(1).toLocaleLowerCase();
    }
  }

  // private testPaymentClaimDetailDailog() {
  //   let claim: PaymentClaimDetail = new PaymentClaimDetail();
  //   claim.claimId = 0;
  //   claim.paidAmount = 5050;
  //   claim.paidAmountUnit = "SAR";
  //   claim.patientFileNumber = "patientFileNumber";
  //   claim.patientName = "patientName";
  //   claim.physicianName = "physicianName";
  //   claim.policyNumber = "policyNumber";
  //   claim.providerClaimNumber = "providerClaimNumber";
  //   claim.rejectedAmount = 0;
  //   claim.rejectedAmountUnit = "SAR";
  //   claim.requestedNetAmount = 5000;
  //   claim.requestedNetAmountUnit = "SAR";
  //   claim.requestedNetVatAmount = 50;
  //   claim.requestedNetVatAmountUnit = "SAR";
  //   claim.statusCode = "PAID";
  //   claim.statusDescription = "Paid";
  //   let service: PaymentServiceDetails = new PaymentServiceDetails();
  //   service.decisionComment = "Paid";
  //   service.invoiceNumber = "invoiceNumber";
  //   service.paidAmount = 5050;
  //   service.paidAmountUnit = "SAR";
  //   service.rejectedAmount = 0;
  //   service.rejectedAmountUnit = "SAR";
  //   service.requestedNetAmount = 5000;
  //   service.requestedNetAmountUnit = "SAR";
  //   service.requestedNetVatAmount = 50;
  //   service.requestedNetVatAmountVat = "SAR";
  //   service.serviceCode = "serviceCode";
  //   service.serviceDate = new Date();
  //   service.serviceDescription = "serviceDescription";
  //   service.serviceStatus = "PAID";
  //   claim.serviceDetails = [service,service,service,service,service,service,service,service,service,service,service,service,service,service,service,service,service];
  //   this.openPaymentClaimDetailDialog(claim);
  // }
  
}
