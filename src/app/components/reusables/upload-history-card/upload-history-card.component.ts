import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UploadSummary } from '../../../models/uploadSummary';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-upload-history-card',
  templateUrl: './upload-history-card.component.html',
  styleUrls: ['./upload-history-card.component.css']
})
export class UploadHistoryCardComponent implements OnInit {

  @Input() data: UploadSummary;
  @Input() isUploadHistroyCenter: boolean;


  constructor(private commen: SharedServices) {

  }

  ngOnInit() {
  }

  get providerId() {
    return this.commen.providerId;
  }

  hideCenter() {
    this.commen.showUploadHistoryCenterChange.next(false);
    this.commen.showValidationDetailsTabChange.next(true);
  }


}
