import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadBeneficiaryCchiErrorsDialogComponent } from '../upload-beneficiary-cchi-errors-dialog/upload-beneficiary-cchi-errors-dialog.component';

@Component({
    selector: 'app-beneficiary-uploads-summary',
    templateUrl: './beneficiary-uploads-summary.component.html',
    styles: []
})
export class BeneficiaryUploadsSummaryComponent implements OnInit {

    constructor(
        private dialog: MatDialog
    ) { }

    openErrorsDialog() {
        const dialogRef = this.dialog.open(UploadBeneficiaryCchiErrorsDialogComponent, {
            panelClass: ['primary-dialog', 'dialog-lg'],
            autoFocus: false
        });
    }

    ngOnInit() {
    }

}
