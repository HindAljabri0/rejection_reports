import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-prescription-item',
  templateUrl: './add-edit-prescription-item.component.html',
  styles: []
})
export class AddEditPrescriptionItemComponent implements OnInit {
  isAddItemVisible: boolean = false;
  isAddItemDetailsVisible: boolean = false;
  isAddDosageTimingVisible: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddEditPrescriptionItemComponent>
  ) { }

  ngOnInit() {
   
  }
  showAddItemPopup() {
    this.isAddItemVisible = true;
    this.isAddItemDetailsVisible = false;
    this.isAddDosageTimingVisible = false;
}

showAddItemDetailsPopup() {
    this.isAddItemVisible = false;
    this.isAddItemDetailsVisible = true;
    this.isAddDosageTimingVisible = false;
}

showAddDosageTimingPopup() {
    this.isAddItemVisible = false;
    this.isAddItemDetailsVisible = false;
    this.isAddDosageTimingVisible = true;
}

  closeDialog() {
    this.dialogRef.close();
  }

}


