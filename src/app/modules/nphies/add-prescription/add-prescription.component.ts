import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditPrescriptionItemComponent } from '../add-edit-prescription-item/add-edit-prescription-item.component';

@Component({
    selector: 'app-add-prescription',
    templateUrl: './add-prescription.component.html',
    styles: []
})
export class AddPrescriptionComponent implements OnInit {

    constructor(
        private dialog: MatDialog
    ) { }

    ngOnInit() {
    }

    openAddEditPrescriptionDialog() {
        const dialogRef = this.dialog.open(AddEditPrescriptionItemComponent, {
            panelClass: ['primary-dialog', 'dialog-xl']
        });
    }

}
