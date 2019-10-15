import { Component } from '@angular/core';
import { UploadService, Summary, ClaimSubmissionData, ClaimUploadStatus } from 'src/app/claimpage/claimfileuploadservice/upload.service';

@Component({
  selector: 'app-notuploadedsummary',
  templateUrl: './notuploadedsummary.component.html',
  styleUrls: ['./notuploadedsummary.component.css']
})
export class NotuploadedsummaryComponent {

  constructor(private uploadService:UploadService) { }

  get summary():Summary {
    return this.uploadService.summary;
  }


}
