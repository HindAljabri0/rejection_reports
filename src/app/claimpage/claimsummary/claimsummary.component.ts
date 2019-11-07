import { Component, OnInit } from '@angular/core';
import { Summary, UploadService, ClaimStatus, UploadedClaim } from '../claimfileuploadservice/upload.service';


@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit {

  showClaims:boolean = false;
  detailsEqualEqual:boolean;
  detailsFilter: string;
  detailsFilter1: string;
  detailCardTitle: string;
  detailAccentColor:string;

  card0Title = 'Total Claims';
  card0ActionText = 'details';
  card0AccentColor = "#3060AA";
  card0Action() {
    this.showClaims = true;
    this.detailsEqualEqual = true;
    this.detailCardTitle = this.card0Title;
    this.detailsFilter = "";
    this.detailsFilter1 = "";
    this.detailAccentColor = this.card0AccentColor;
  }

  card1Title = 'Accepted';
  card1ActionText = 'details';
  card1AccentColor = "#21B744";
  card1Action() {
    this.showClaims = true;
    this.detailsEqualEqual = true;
    this.detailCardTitle = this.card1Title;
    this.detailsFilter = ClaimStatus.Accepted;
    this.detailsFilter1 = "";
    this.detailAccentColor = this.card1AccentColor;
  }

  card2Title = 'Not Accepted';
  card2ActionText = 'details';
  card2AccentColor = "#EB2A75"
  card2Action() {
    this.showClaims = true;
    this.detailsEqualEqual = true;
    this.detailCardTitle = this.card2Title;
    this.detailsFilter = ClaimStatus.Not_Accepted;
    this.detailsFilter1 = "";
    this.detailAccentColor = this.card2AccentColor;
  }

  card3Title = 'Not Uploaded';
  card3ActionText = 'details';
  card3AccentColor = "#E3A820";
  card3Action() {
    this.showClaims = true;
    this.detailsEqualEqual = false;
    this.detailCardTitle = this.card3Title;
    this.detailsFilter1 = ClaimStatus.Accepted;
    this.detailsFilter = ClaimStatus.Not_Accepted;
    this.detailAccentColor = this.card3AccentColor;
  }

  applyFilter(status:string):boolean{
    return this.showClaims && ((this.detailsEqualEqual && (status == this.detailsFilter || status == this.detailsFilter1)) || ((!this.detailsEqualEqual) && (status != this.detailsFilter && status != this.detailsFilter1)));
  }


  constructor(private uploadService: UploadService) {}

  ngOnInit() {
    this.uploadService.summaryChange.subscribe(value =>{
      if(value.noOfUploadedClaims != 0){
        this.card0Action();
      } else if(value.noOfAcceptedClaims != 0){
        this.card1Action();
      } else if(value.noOfNotAcceptedClaims != 0){
        this.card2Action();
      } else if(value.noOfNotUploadedClaims != 0){
        this.card3Action();
      }
    });
  }

  get summary(): Summary {
    return this.uploadService.summary;
  }

}
