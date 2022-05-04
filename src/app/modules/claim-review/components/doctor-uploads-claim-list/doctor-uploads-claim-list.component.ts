import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { time } from 'console';
import { ClaimReviewService } from '../../services/claim-review-service/claim-review.service';

@Component({
  selector: 'app-doctor-uploads-claim-list',
  templateUrl: './doctor-uploads-claim-list.component.html',
  styles: []
})
export class DoctorUploadsClaimListComponent implements OnInit {

  public id : number;
  public claimDetails : any;
  constructor(private router : ActivatedRoute,private claimReviewService : ClaimReviewService) { 
    
  }
  ngOnInit() {
    this.id = this.router.snapshot.params.id;
    this.claimReviewService.selectDetailView(this.id,0,10).subscribe(response => {
      this.claimDetails = response;
      console.log(this.claimDetails);
      
    });
  }

}
