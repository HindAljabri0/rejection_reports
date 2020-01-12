import { Component, OnInit } from '@angular/core';
import { CommenServicesService } from 'src/app/services/commen-services.service';

@Component({
  selector: 'app-upload-history-center',
  templateUrl: './upload-history-center.component.html',
  styleUrls: ['./upload-history-center.component.css']
})
export class UploadHistoryCenterComponent implements OnInit {

  inCenter = true;

  showCenter:boolean = false;

  constructor(private commen:CommenServicesService) {
    this.commen.showUploadHistoryCenterChange.subscribe(value => {
      this.showCenter = value;
    });
  }

  ngOnInit() {
  }

  get dataList(){
    return this.commen.uploadHistoryList;
  }

  hideCenter(){
    this.commen.showUploadHistoryCenterChange.next(false);
  }

}
