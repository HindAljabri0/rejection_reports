import { Component, OnInit, HostListener } from '@angular/core';
import { Announcement } from 'src/app/models/announcement';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementsService } from 'src/app/services/announcementService/announcements.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
// import { InfiniteScroll } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-announcements-page',
  templateUrl: './announcements-page.component.html',
  styleUrls: ['./announcements-page.component.css'],
})
export class AnnouncementsPageComponent implements OnInit {

  providerId: string;
  cardTitle = 'All Announcements';
  currentPage = 0;
  pageSize = 10;

  // modalScrollDistance = 2;
  // throttle = 300;



  announcementsMap: Map<string, Announcement[]> = new Map();
  announcementsMapKeys: string[] = new Array();

  totalAnnouncements = 0;
  currentAnnouncementsCount = 0;
  payers: { id: number, name: string }[];
  payerids: number[];

  constructor(
    public commen: SharedServices,
    public routeActive: ActivatedRoute,
    public announcementsService: AnnouncementsService,
  ) { }

  ngOnInit() {
    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    });
    this.payers = this.commen.getPayersList();
    this.payerids = this.payers.map(item => item.id);
    this.getData(false);
  }



  getData(nextPage: boolean) {
    if (nextPage) {
      this.currentPage++;
    }
    this.announcementsService.getAnnouncements(this.providerId, this.payerids, this.currentPage, this.pageSize).subscribe(event => {
      if (event instanceof HttpResponse) {
        const paginatedResult: PaginatedResult<Announcement> = new PaginatedResult(event.body, Announcement);
        this.totalAnnouncements = paginatedResult.totalElements;
        for (const announcement of paginatedResult.content) {
          const id = announcement.messageId;
          if (!this.announcementsMap.has(`${id}`)) {
            this.announcementsMap.set(`${id}`, new Array());
            this.announcementsMapKeys.push(`${id}`);
          }
          this.announcementsMap.get(`${id}`).push(announcement);

          this.currentAnnouncementsCount++;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) { }
    });
  }

  announcementsNotFinished() {
    return this.currentAnnouncementsCount < this.totalAnnouncements;
  }

  /* onScrollDown() {
     console.log('scrolled down!!');
   }*/

}
