import { Component, OnInit } from '@angular/core';
import { Summary, UploadService, ClaimStatus, UploadedClaim } from '../claimfileuploadservice/upload.service';


@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit {

  detailsFilter: string;
  detailsFilter1: string;
  detailCardTitle: string;

  card0Title = 'Total Claims';

  card1Title = 'Accepted Calims';
  card1ActionText = 'details';
  card1Action() {
    this.detailCardTitle = this.card1Title;
    this.detailsFilter = ClaimStatus.Saved;
    this.detailsFilter1 = "";
  }

  card2Title = 'Not Accepted Claims';
  card2ActionText = 'details';
  card2Action() {
    this.detailCardTitle = this.card2Title;
    this.detailsFilter = ClaimStatus.Saved_With_Errors;
    this.detailsFilter1 = "";
  }

  card3Title = 'Not Uploaded Claims';
  card3ActionText = 'details';
  card3Action() {
    this.detailCardTitle = this.card3Title;
    this.detailsFilter = ClaimStatus.Duplicated;
    this.detailsFilter1 = ClaimStatus.Not_Saved;
  }


  constructor(private uploadService: UploadService) {}

  ngOnInit() {
  }

  get summary(): Summary {
    return this.uploadService.summary;
  }
  // tslint:disable-next-line:member-ordering
  showNotUploadedDetails = false;

  toggleNotUploadedDetails() {
    this.showNotUploadedDetails = !this.showNotUploadedDetails;
  }
}
