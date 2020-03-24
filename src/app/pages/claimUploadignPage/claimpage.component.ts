import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/claimfileuploadservice/upload.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { Location } from '@angular/common';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-claimpage',
  templateUrl: './claimpage.component.html',
  styleUrls: ['./claimpage.component.css']
})
export class ClaimpageComponent implements OnInit {

  uploadingObs:boolean = false;
  constructor(private uploadService:UploadService, public location: Location, private commen:CommenServicesService, private router: Router) {
    this.uploadService.uploadingObs.subscribe(value => this.uploadingObs = value);
  }

  ngOnInit() {
  }

  viewClaims(){
    this.router.navigate([this.providerId, 'claims'], {queryParams: {uploadId: this.summary.uploadSummaryID}})
  }

  get summary(): UploadSummary {
    if(this.location.path().includes("summary"))
      return this.uploadService.summary;
    else
      return new UploadSummary();
  }

  get uploading(): boolean {
    return this.uploadingObs;
  }

  get summaryDate(): string {
    if(this.summary.uploadSummaryID != undefined){
      if(!(this.summary.uploadDate instanceof Date))
        this.summary.uploadDate = new Date(this.summary.uploadDate);
      return this.summary.uploadDate.toLocaleDateString();
    } else return '';
  }

  get providerId(){
    return this.commen.providerId;
  }
}
