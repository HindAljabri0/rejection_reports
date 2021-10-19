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
    return this.data.ready_for_submission + this.data.rejected_by_waseel + this.data.undersubmission
      + this.data.underprocessing + this.data.paid + this.data.partially_paid + this.data.rejected_by_payer
      + this.data.invalid + this.data.downloadable + this.data.submitted_outside_waseel;
  }

  get canBeDeleted() {
    return (this.sharedServices.isAdmin && this.sharedServices.isProvider)
      || (this.data.ready_for_submission + this.data.rejected_by_waseel + this.data.invalid + this.data.downloadable) > 0;
  }

}
