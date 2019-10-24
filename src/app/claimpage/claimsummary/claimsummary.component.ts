import { Component, OnInit } from '@angular/core';
import { Summary, UploadService } from '../claimfileuploadservice/upload.service';


@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit {

  detailsFilter: string;
  detailCardTitle: string;


  card1Title = 'Uploaded Claims';
  card1ActionText = 'details';
  card1Action() {
    this.detailCardTitle = this.card1Title;
    this.detailsFilter = 'saved';
  }
  // tslint:disable-next-line: member-ordering
  card2Title = 'Not Uploaded Claims';
  // tslint:disable-next-line: member-ordering
  card2ActionText = 'details';
  card2Action() {
    this.detailCardTitle = this.card2Title;
    this.detailsFilter = 'NOTUPLOADED';
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
