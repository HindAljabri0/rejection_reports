import { Component, OnInit } from '@angular/core';
import { Summary, UploadService } from '../claimfileuploadservice/upload.service';

@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit {

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



