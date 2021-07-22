import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-xml-view-dialog',
  templateUrl: './xml-view-dialog.component.html',
  styles: []
})
export class XmlViewDialogComponent implements OnInit {
  xmlData: any;

  constructor(
    private dialogRef: MatDialogRef<XmlViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  editorOptions = { theme: '', language: 'xml', readOnly: true };
  ngOnInit() {
    this.xmlData = this.data.mainData.submittedData;
  }
  onInit(editor) {
    const line = editor.getPosition();
    console.log(line);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  download() {
    let filename = "sample.xml";
    let pom = document.createElement('a');
    let bb = new Blob([this.xmlData], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();
  }

}
