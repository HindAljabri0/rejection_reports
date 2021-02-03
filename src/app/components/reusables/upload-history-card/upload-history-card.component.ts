import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UploadSummary } from '../../../models/uploadSummary';
import { SharedServices } from 'src/app/services/shared.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-history-card',
  templateUrl: './upload-history-card.component.html',
  styleUrls: ['./upload-history-card.component.css']
})
export class UploadHistoryCardComponent implements OnInit {

  @Input() data: UploadSummary;
  @Input() isUploadHistroyCenter: boolean;
  @Input() fromRightSideBar = false;

  constructor(private commen: SharedServices, private router: Router) { }

  ngOnInit() {
  }

  get providerId() {
    return this.commen.providerId;
  }

  hideCenter() {
    this.commen.showUploadHistoryCenterChange.next(false);
    this.commen.showValidationDetailsTabChange.next(true);
    if (this.fromRightSideBar) {
      this.router.navigateByUrl(this.providerId + '/claims?uploadId=' + this.data.uploadSummaryID);
    } else {
      this.router.navigateByUrl('summary?id=' + this.data.uploadSummaryID);
    }
  }
}
