import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Announcement } from 'src/app/models/announcement';

@Component({
  selector: 'app-announcement-center',
  templateUrl: './announcement-center.component.html',
  styleUrls: ['./announcement-center.component.css']
})
export class AnnouncementCenterComponent implements OnInit {
  status;
  announcementsList: Announcement[];
  constructor(public commen: SharedServices) {
    this.commen.showAnnouncementCenterChange.subscribe(value => {
      this.toggleAnnouncementCenter(value);
    });
    this.commen.announcementsListChange.subscribe(list => {
      this.announcementsList = list;
    });
  }

  ngOnInit() {
    // this.commen.showNotificationCenterChange.next(true);
  }

  toggleAnnouncementCenter(show: boolean) {
    if (show) {
      this.status = 'show';
    } else { this.status = ''; }
  }

  //get numOfUnreadAnnouncements() {
  //  return this.commen.unReadAnnouncementsCount;
  //}

  get numOfAnnouncements() {
    return this.commen.announcementsCount;
  }

  get providerId() {
    return this.commen.providerId;
  }

  // markAsRead(id:string){
  //   this.commen.markAsRead(id, "102");
  // }

}
