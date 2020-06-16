import { Component, OnInit, HostListener } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { async } from 'q';
// import { InfiniteScroll } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css'],
})
export class NotificationsPageComponent implements OnInit {

  providerId:string;
  cardTitle:string = 'All Notifications';
  currentPage:number = 0;
  pageSize:number = 10;

  // modalScrollDistance = 2;
  // throttle = 300;



  notificationMap:Map<string, Notification[]> = new Map();
  notificationsMapKeys:string[] = new Array();

  totalNotifications:number = 0;
  currentNotificationsCount:number = 0;
  errorMessage:string;

  constructor(public commen:SharedServices, public routeActive:ActivatedRoute, public notificationService:NotificationsService) { }

  ngOnInit() {
    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    });
    this.getData(false);
  }



  getData(nextPage:boolean){
    this.errorMessage = null;
    if(nextPage) this.currentPage++;
    this.notificationService.getNotifications(this.providerId, this.currentPage, this.pageSize).subscribe(event => {
      if(event instanceof HttpResponse){
        const paginatedResult:PaginatedResult<Notification> = new PaginatedResult(event.body, Notification);
        this.totalNotifications = paginatedResult.totalElements;
        for(let notification of paginatedResult.content){
          const year = notification.datetime.getFullYear();
          const month = notification.datetime.getMonth()+1;
          if(!this.notificationMap.has(`${year}/${month}`)){
            this.notificationMap.set(`${year}/${month}`, new Array());
            this.notificationsMapKeys.push(`${year}/${month}`);
          }
          this.notificationMap.get(`${year}/${month}`).push(notification);
          this.currentNotificationsCount++;
        }
        if( this.totalNotifications == 0 &&
          this.currentNotificationsCount == 0)
          {
            this.errorMessage="No Notifications Found";
          }
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        
      }
    });

   

  }

  notificationsNotFinished(){
    return this.currentNotificationsCount < this.totalNotifications
  }

 /* onScrollDown() {
    console.log('scrolled down!!');
  }*/

}
