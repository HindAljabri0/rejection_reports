import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export class DialogData{
  title:string;
  message:string;
  isError:boolean = false;
  constructor(title:string, message:string, isError:boolean){
    this.title = title;
    this.message = message;
    this.isError = isError;
  }
}
