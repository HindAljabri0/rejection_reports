import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Location } from '@angular/common';
import { NphiesClaimUploaderService, UploadSummary } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';

@Component({
  selector: 'app-upload-claim',
  templateUrl: './upload-claim.component.html',
  styleUrls: ['./upload-claim.component.css']
})
export class UploadClaimComponent implements OnInit {

  uploadingObs = false;
  constructor(
    private uploadService: NphiesClaimUploaderService,
    public location: Location,
    private commen: SharedServices,
  ) {
    this.uploadService.uploadingObs.subscribe(value => this.uploadingObs = value);
  }

  ngOnInit() {
  }


  get summary(): UploadSummary {
    if (this.location.path().includes('summary')) {
      return this.uploadService.summary;
    } else {
      return new UploadSummary();
    }
  }

  get uploading(): boolean {
    return this.uploadingObs;
  }

  get summaryDate(): string {
    if (this.summary.uploadSummaryID != undefined) {
      if (!(this.summary.uploadDate instanceof Date)) {
        this.summary.uploadDate = new Date(this.summary.uploadDate);
      }
      return this.summary.uploadDate.toLocaleDateString();
    } else { return ''; }
  }

  get providerId() {
    return this.commen.providerId;
  }

}
