import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-claim-page',
  templateUrl: './main-claim-page.component.html',
  styleUrls: ['./main-claim-page.component.css']
})
export class MainClaimPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const claimId = this.router.routerState.snapshot.url.split('/')[2];
    if(claimId != 'add'){
      //to be changed later if we decide to view/edit the claim here.
      this.router.navigate(['/']);
    }
  }

}
