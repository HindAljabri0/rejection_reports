import { Component, OnInit, Input } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-nphies-upload-card',
  templateUrl: './nphies-upload-card.component.html',
  styleUrls: ['./nphies-upload-card.component.css']
})
export class NphiesUploadCardComponent implements OnInit {

  @Input() data: any;

  constructor(private sharedServices: SharedServices) { }

  ngOnInit() {

  }

  get totalClaims() {
    return this.data.readyForSubmission + this.data.rejectedByWaseel + this.data.underSubmission
      + this.data.underProcessing + this.data.paid + this.data.partiallyPaid + this.data.rejectedByPayer;
  }

  get canBeDeleted() {
    return (this.sharedServices.isAdmin && this.sharedServices.isProvider)
      || (this.data.readyForSubmission + this.data.rejectedByWaseel) > 0;
  }

}
