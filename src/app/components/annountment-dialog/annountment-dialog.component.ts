import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-annountment-dialog',
  templateUrl: './annountment-dialog.component.html',
  styles: []
})
export class AnnountmentDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AnnountmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  Announcements = [];

  ngOnInit() {
    this.Announcements = this.data.AnnouncementsInfo;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkfileType(fileName: string) {
    let fileExtension = fileName.split(".")[1];
    let src = './assets/file-types/'
    switch (fileExtension.toUpperCase()) {
      case "PDF":
        return src + "ic-pdf.svg"
      case "XLS":
        return src + "ic-xls.svg"
      case "CSV":
        return src + "ic-csv.svg"
      case "ZIP":
        return src + "ic-zip.svg"
      case "XLSX":
        return src + "ic-xls.svg"
      case "JPG":
        return src + "ic-jpg.svg"
      case "PNG":
        return src + "ic-jpg.svg"
      default:
        return 'unKnown'
    }

  }

  openFile(attachmentContent: string, fileType: string) {
    let blob = this.convertBase64ToBlob(attachmentContent, fileType);
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL)
  }


  convertBase64ToBlob(Base64: string, contentType: string) {
    const byteArray = new Uint8Array(atob(Base64).split('').map((char) => char.charCodeAt(0)));
    return new Blob([byteArray], { type: contentType });
  }

}
