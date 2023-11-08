import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-upload-beneficiary-cchi-errors-dialog',
    templateUrl: './upload-beneficiary-cchi-errors-dialog.component.html',
    styles: []
})
export class UploadBeneficiaryCchiErrorsDialogComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<UploadBeneficiaryCchiErrorsDialogComponent>
    ) { }

    ngOnInit() {
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
