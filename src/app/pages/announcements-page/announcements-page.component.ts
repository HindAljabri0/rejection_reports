import { Component, OnInit, HostListener } from '@angular/core';
import { Announcement } from 'src/app/models/announcement';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementsService } from 'src/app/services/announcementService/announcements.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { async } from 'q';
// import { InfiniteScroll } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-announcements-page',
  templateUrl: './announcements-page.component.html',
  styleUrls: ['./announcements-page.component.css'],
})
export class AnnouncementsPageComponent implements OnInit {

  providerId:string;
  cardTitle:string = 'All Announcements';
  currentPage:number = 0;
  pageSize:number = 10;

  // modalScrollDistance = 2;
  // throttle = 300;



  announcementsMap:Map<string, Announcement[]> = new Map();
  announcementsMapKeys:string[] = new Array();

  totalAnnouncements: number = 0;
  currentAnnouncementsCount:number = 0;

  constructor(public commen:SharedServices, public routeActive:ActivatedRoute, public announcementsService: AnnouncementsService) { }

  ngOnInit() {
    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    });
    this.getData(false);
  }



  getData(nextPage:boolean){
    if(nextPage) this.currentPage++;
    this.announcementsService.getAnnouncements(this.providerId, '204', this.currentPage, this.pageSize).subscribe(event => {
      if(event instanceof HttpResponse){
        const paginatedResult:PaginatedResult<Announcement> = new PaginatedResult(event.body, Announcement);
        this.totalAnnouncements = paginatedResult.totalElements;
        for(let announcement of paginatedResult.content){
          const id = announcement.messageId;
          if(!this.announcementsMap.has(`${id}`)){
            this.announcementsMap.set(`${id}`, new Array());
            this.announcementsMapKeys.push(`${id}`);
          }
          this.announcementsMap.get(`${id}`).push(announcement);
          
         this.currentAnnouncementsCount++;
        }
      }
    }, errorEvent => {
      if(errorEvent instanceof HttpErrorResponse) {
      }
    });
  }

  announcementsNotFinished() {
    return this.currentAnnouncementsCount < this. totalAnnouncements;
  }

 /* onScrollDown() {
    console.log('scrolled down!!');
  }*/

}
