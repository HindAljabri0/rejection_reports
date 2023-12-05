import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
//import { getMREClaimError, getMREClaimStatus } from '../store/claim.reducer';
@Component({
  selector: 'app-mre-comments',
  templateUrl: './mre-comments.component.html',
  styleUrls: []
})
export class MreCommentsComponent implements OnInit {
    mreClaimError: any[] = [];
    mreClaimStatus: string;
    constructor(private store: Store) { }

  ngOnInit() {
    
    // this.mreClaimError = this.mreClaimError !== null && this.mreClaimError !== undefined && this.mreClaimError.length > 0
    //   ? this.mreClaimError
    //   : [];
}

}




 

