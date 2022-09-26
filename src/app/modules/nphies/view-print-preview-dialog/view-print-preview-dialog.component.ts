import { style } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
/* import * as es6printJS from "print-js"; */
import * as print from "print-js";
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
/* import * as printJS from "print-js"; */

@Component({
  selector: 'app-view-print-preview-dialog',
  templateUrl: './view-print-preview-dialog.component.html',
  styles: []
})
export class ViewPrintPreviewDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ViewPrintPreviewDialogComponent>, private sharedDataService:SharedDataService,@Inject(MAT_DIALOG_DATA) public data:any) { }

  preAuthId :number;
  type:string;
  ngOnInit() {
    this.preAuthId = this.data.preAuthId;
    this.type = this.data.type;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  printForm(){
    document.querySelector('html').classList.add('print-document');
    window.print();
    document.querySelector('html').classList.remove('print-document');
    /* print(
      {
        printable:'print_id', 
        type:'html',
        style:this.sharedDataService.style,
      }); */
  }

}
