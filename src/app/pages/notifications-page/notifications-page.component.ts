import { Component, OnInit, HostListener } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { async } from 'q';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit {

  providerId:string;
  cardTitle:string = 'All Notifications';
  currentPage:number = 0;
  pageSize:number = 10;

  notificationMap:Map<string, Notification[]> = new Map();
  notificationsMapKeys:string[] = new Array();

  totalNotifications:number = 0;
  currentNotificationsCount:number = 0;

  constructor(public commen:CommenServicesService, public routeActive:ActivatedRoute, public notificationService:NotificationsService) { }

  ngOnInit() {
    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    });
    this.getData(false);
  }



  getData(nextPage:boolean){
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
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse){
        
      }
    });
  }

  notificationsNotFinished(){
    return this.currentNotificationsCount < this.totalNotifications
  }

}
