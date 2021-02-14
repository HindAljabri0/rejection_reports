import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styles: []
})
export class MessageDialogComponent implements OnInit {

  // textColor = '#8FBE9A';
  textColor = '#1C7C26';

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    if (this.data.isError) {
      this.textColor = '#CC2F2F';
    }
    if (this.data.withButtons) {
      this.textColor = '';
    }
  }

}
