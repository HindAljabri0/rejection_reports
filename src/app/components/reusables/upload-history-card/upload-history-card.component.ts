import { Component, OnInit, Input } from '@angular/core';
import { UploadSummary } from '../../../models/uploadSummary';
import { SharedServices } from 'src/app/services/shared.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-history-card',
  templateUrl: './upload-history-card.component.html',
  styles: []
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

    this.commen.showUploadsCenterChange.next(false);
    if (this.fromRightSideBar) {
      this.router.navigateByUrl(this.providerId + '/claims?uploadId=' + this.data.uploadSummaryID);
    } else if (typeof this.data.uploadSummaryID != "undefined") {
      this.router.navigateByUrl('summary?id=' + this.data.uploadSummaryID);
    } else {
      this.router.navigateByUrl('nphies/summary?id=' + this.data.uploadId);
    }
  }

  isNan(value) {

    return !isNaN(value) ? value : -1;
  }
}
