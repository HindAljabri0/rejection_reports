import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UploadSummary } from '../../../models/uploadSummary';
import { CommenServicesService } from 'src/app/services/commen-services.service';

@Component({
  selector: 'app-upload-history-card',
  templateUrl: './upload-history-card.component.html',
  styleUrls: ['./upload-history-card.component.css']
})
export class UploadHistoryCardComponent implements OnInit {

  @Input() data: UploadSummary;
  @Input() isUploadHistroyCenter: boolean;

  constructor(private commen:CommenServicesService) {
    
  }

  ngOnInit() {
  }

  

  hideCenter(){
    this.commen.showUploadHistoryCenterChange.next(false);
  }


}
