import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // textColor = '#8FBE9A';
  textColor = '#19A33A';
  backgroundColor = '#F0FFF4';

  ngOnInit() {
    if(this.data.isError) this.textColor = '#7e0433';
    if(this.data.withButtons){
      this.textColor = '#3060AA';
      this.backgroundColor = 'white';
    }
  }

}


