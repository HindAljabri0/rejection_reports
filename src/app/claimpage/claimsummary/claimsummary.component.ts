import { Component, OnInit } from '@angular/core';
import { Summary, UploadService, ClaimStatus, UploadedClaim } from '../claimfileuploadservice/upload.service';


@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit {

  detailsNoFilter:boolean;
  detailsEqualEqual:boolean;
  detailsFilter: string;
  detailsFilter1: string;
  detailCardTitle: string;
  detailAccentColor:string;

  cardsAreClickable = false;
  card0Title = 'Total Claims';
  card0ActionText = 'details';
  card0AccentColor = "#3060AA";
  card0Action() {
    this.detailsNoFilter = true;
    this.detailsEqualEqual = true;
    this.detailCardTitle = this.card0Title;
    this.detailsFilter = "";
    this.detailsFilter1 = "";
    this.detailAccentColor = this.card0AccentColor;
  }

  card1Title = 'Accepted Calims';
  card1ActionText = 'details';
  card1AccentColor = "#21B744";
  card1Action() {
    this.detailsNoFilter = false;
    this.detailsEqualEqual = true;
    this.detailCardTitle = this.card1Title;
    this.detailsFilter = ClaimStatus.Saved;
    this.detailsFilter1 = "";
    this.detailAccentColor = this.card1AccentColor;
  }

  card2Title = 'Not Accepted Claims';
  card2ActionText = 'details';
  card2AccentColor = "#EB2A75"
  card2Action() {
    this.detailsNoFilter = false;
    this.detailsEqualEqual = true;
    this.detailCardTitle = this.card2Title;
    this.detailsFilter = ClaimStatus.Saved_With_Errors;
    this.detailsFilter1 = "";
    this.detailAccentColor = this.card2AccentColor;
  }

  card3Title = 'Not Uploaded Claims';
  card3ActionText = 'details';
  card3AccentColor = "#E3A820";
  card3Action() {
    this.detailsNoFilter = false;
    this.detailsEqualEqual = false;
    this.detailCardTitle = this.card3Title;
    this.detailsFilter1 = ClaimStatus.Saved;
    this.detailsFilter = ClaimStatus.Saved_With_Errors;
    this.detailAccentColor = this.card3AccentColor;
  }

  applyFilter(status:string):boolean{
    return (this.detailsEqualEqual && (status == this.detailsFilter || status == this.detailsFilter1)) || ((!this.detailsEqualEqual) && (status != this.detailsFilter && status != this.detailsFilter1));
  }


  constructor(private uploadService: UploadService) {}

  ngOnInit() {
    this.card0Action();
  }

  get summary(): Summary {
    this.cardsAreClickable = this.uploadService.summary.uploadSummaryID != undefined;
    return this.uploadService.summary;
  }

}
