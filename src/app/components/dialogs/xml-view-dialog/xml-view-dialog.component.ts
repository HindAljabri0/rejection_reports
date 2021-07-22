import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-xml-view-dialog',
  templateUrl: './xml-view-dialog.component.html',
  styleUrls: ['./xml-view-dialog.component.css']
})
export class XmlViewDialogComponent implements OnInit {
  xmlData: any;

  constructor(private dialogRef: MatDialogRef<XmlViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  editorOptions = { theme: '', language: 'xml', readOnly: true };
  ngOnInit() {
    this.xmlData = this.data.mainData.submittedData;

  }
  onInit(editor) {
    let line = editor.getPosition();
    console.log(line);
  }

}
