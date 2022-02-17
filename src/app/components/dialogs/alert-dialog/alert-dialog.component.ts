import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styles: []
})
export class AlertDialogComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string
    ) {

    }

    ngOnInit() {
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
