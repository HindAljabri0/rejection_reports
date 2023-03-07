
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';


@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styles: []
})
export class AlertDialogComponent implements OnInit {
    isHasNphiesPrivileges = false;
    isOverNphiesdwonTime = false;

    constructor(
        private dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string[],
        private commenServices: SharedServices,

    ) {

    }



    ngOnInit() {
        this.isHasNphiesPrivileges = this.commenServices.isHasNphiesPrivileges();
        this.isOverNphiesdwonTime = this.commenServices.isOverNphiesdwonTime();
    }


    closeDialog() {
        this.dialogRef.close();
    }
}
