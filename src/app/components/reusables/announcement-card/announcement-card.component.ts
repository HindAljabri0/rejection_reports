import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementsService } from 'src/app/services/announcementService/announcements.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { Announcement } from 'src/app/models/announcement';

@Component({
  selector: 'app-announcement-card',
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.css']
})
export class AnnouncementCardComponent implements OnInit {

  @Input() announcement: Announcement;
    
    payerIcon: string;
    payerids: number[];

    ngOnInit() {
      this.payerids = this.commen.getPayersList().map(item => item.id);
    }
    constructor(private router: Router, public announcementService: AnnouncementsService,
                public dialogService: DialogService, private commen: SharedServices,
                public routeActive: ActivatedRoute) {
  }

  parseInt(str: string) {
    return Number.parseInt(str);
  }


  getAnnouncements() {
    this.announcementService.getAnnouncements(this.commen.providerId, this.payerids, 0, 10)
    .subscribe(event => {
      if (event instanceof HttpResponse) {
        this.router.navigate([this.commen.providerId, 'announcements']);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog(new MessageDialogData('',
         'Could not reach the server. Please try again later.', true));
      }
    });
   }

}
