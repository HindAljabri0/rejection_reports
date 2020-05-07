import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-upload-history-center',
  templateUrl: './upload-history-center.component.html',
  styleUrls: ['./upload-history-center.component.css']
})
export class UploadHistoryCenterComponent implements OnInit {

  inCenter = true;

  showCenter:boolean = false;

  constructor(private commen:SharedServices) {
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
