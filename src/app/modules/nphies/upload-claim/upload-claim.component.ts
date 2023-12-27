import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Location } from '@angular/common';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';


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
    private dialogService: DialogService,
    private sharedServices: SharedServices,
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
    if (this.summary.uploadId != undefined) {
      if (!(this.summary.uploadDate instanceof Date)) {
        this.summary.uploadDate = new Date(this.summary.uploadDate);
      }
      return this.summary.uploadDate.toLocaleDateString();
    } else { return ''; }
  }

  get providerId() {
    return this.commen.providerId;
  }
  downloadSample() {

    this.uploadService.download(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          var data = new Blob([event.body as BlobPart], { type: 'application/octet-stream' });
          const FileSaver = require('file-saver');
        FileSaver.saveAs(data, "SampleClaimDownload.xlsx");
        }
      }
    }
      , err => {
        if (err instanceof HttpErrorResponse) {
          this.dialogService.openMessageDialog({
            title: '',
            message: `Unable to download File at this moment`,
            isError: true
          });
        }
      });
  }
}
