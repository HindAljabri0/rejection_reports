import { Component, Input, OnInit } from '@angular/core';
import { UploadCardData } from 'src/app/models/UploadCardData';

@Component({
  selector: 'app-upload-card',
  templateUrl: './upload-card.component.html',
  styleUrls: ['./upload-card.component.css']
})
export class UploadCardComponent implements OnInit {

  @Input()
  data:UploadCardData;

  constructor() { }

  ngOnInit() {
    
  }

  get totalClaims() {
    return this.data.ready_for_submission + this.data.rejected_by_waseel + this.data.undersubmission 
    + this.data.underprocessing + this.data.paid + this.data.partially_paid + this.data.rejected_by_payer 
    + this.data.invalid + this.data.downloadable;
}

}
