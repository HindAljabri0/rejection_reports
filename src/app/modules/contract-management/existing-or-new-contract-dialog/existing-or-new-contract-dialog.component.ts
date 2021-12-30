import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-existing-or-new-contract-dialog',
  templateUrl: './existing-or-new-contract-dialog.component.html',
  styles: []
})
export class ExistingOrNewContractDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ExistingOrNewContractDialogComponent>,
    private router: Router
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  redirectToAddPage() {
    this.router.navigate(['/contract-management/add']);
    this.dialogRef.close();
  }

}
