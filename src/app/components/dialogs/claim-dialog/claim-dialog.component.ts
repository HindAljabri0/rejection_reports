import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ViewedClaim } from 'src/app/models/viewedClaim';

@Component({
  selector: 'app-claim-dialog',
  templateUrl: './claim-dialog.component.html',
  styleUrls: ['./claim-dialog.component.css']
})
export class ClaimDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ClaimDialogComponent>, @Inject(MAT_DIALOG_DATA) public claim:ViewedClaim) { }

  ngOnInit() {
    console.log(this.claim);
  }

}
