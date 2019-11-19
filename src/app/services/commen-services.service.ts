import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../components/dialogs/message-dialog/message-dialog.component';
import { ClaimStatus } from '../models/claimStatus';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificationsService } from './notificationService/notifications.service';
import { HttpResponse } from '@angular/common/http';
import { Notification } from '../models/notification';
import { PaginatedResult } from '../models/paginatedResult';
import { MessageDialogData } from '../models/dialogData/messageDialogData';
import { ViewedClaim } from '../models/viewedClaim';
import { SearchServiceService } from './serchService/search-service.service';
import { ClaimDialogComponent } from '../components/dialogs/claim-dialog/claim-dialog.component';

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
  
  constructor(public dialog:MatDialog, private router:Router, private notifications:NotificationsService, private search:SearchServiceService) {
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
    this.getClaimAndViewIt('104', '7692');
  }

  getNotifications(){
    this.notifications.getNotificationsCount('102', 'unread').subscribe(event => {
      if(event instanceof HttpResponse){
        const count = Number.parseInt(`${event.body}`);
        if(!Number.isNaN(count))
          this.unReadNotificationsCountChange.next(count);
      }
    });
    this.notifications.getNotifications('102', 0, 10).subscribe(event => {
      if(event instanceof HttpResponse){
        const paginatedResult:PaginatedResult<Notification> = new PaginatedResult(event.body, Notification);
        this.notificationsListChange.next(paginatedResult.content);
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

  getClaimAndViewIt(providerId:string, claimId:string){
    this.search.getClaim(providerId, claimId).subscribe(event => {
      if(event instanceof HttpResponse){
        const claim = JSON.parse(JSON.stringify(event.body));
        console.log(claim);
        this.openClaimDialog(claim);
      }
    });
  }

  openClaimDialog(claim:ViewedClaim):Observable<any>{
    const dialogRef = this.dialog.open(ClaimDialogComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'claimDialog',
      data: claim,
    });
    return dialogRef.afterClosed();
  }

  getCardAccentColor(status:string){
    switch(status){
      case ClaimStatus.Accepted:
        return '#21B744';
      case ClaimStatus.Not_Accepted:
        return '#EB2A75';
      case 'All':
        return '#3060AA'
      case '-':
        return '#bebebe';
      case 'Batched':
        return '#21b590';
      case 'INVALID':
        return '#E988AD';
      case 'Failed':
        return '#bf1958';
      default:
        return '#E3A820';
    }
  }

  
}
