import { Component, OnInit } from '@angular/core';
import { Summary, UploadService, ClaimUploadStatus } from '../claimfileuploadservice/upload.service';

@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit {

  card1Title = "Uploaded Claims";
  card1ActionText = "details";
  card1Action(){
    this.detailCardTitle = this.card1Title;
    this.detailsFilter = 'UPLOADED';
  }
  card2Title = "Not Uploaded Claims";
  card2ActionText = "details";
  card2Action(){
    this.detailCardTitle = this.card2Title;
    this.detailsFilter = 'NOTUPLOADED';
  }

  detailCardTitle:string;
  detailsFilter:string;

  showNotUploadedDetails:boolean = false;
  constructor(private uploadService:UploadService) {}

  
  ngOnInit() {
    
  }
  
  get summary():Summary{
    return this.uploadService.summary;
  }

  toggleNotUploadedDetails(){
    this.showNotUploadedDetails = !this.showNotUploadedDetails;
  }

}



