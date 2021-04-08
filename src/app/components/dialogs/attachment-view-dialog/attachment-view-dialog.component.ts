import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AttachmentViewData } from './attachment-view-data';

@Component({
  selector: 'app-attachment-view-dialog',
  templateUrl: './attachment-view-dialog.component.html',
  styleUrls: ['./attachment-view-dialog.component.css']
})
export class AttachmentViewDialogComponent implements OnInit {


  attachmentSource: SafeResourceUrl;

  constructor(
    private dialogRef: MatDialogRef<AttachmentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentViewData,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.isPdf())
      this.dialogRef.updateSize("80%", "85%");
    this.setAttachmentSource();
  }


  setAttachmentSource() {
    const fileExt = this.data.filename.split('.').pop();
    if (this.data.attachment instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(this.data.attachment);
      reader.onload = (_event) => {
        let data: string = reader.result as string;
        data = data.substring(data.indexOf(',') + 1);
        this.attachmentSource = data;
      };
    } else {
      if (fileExt.toLowerCase() == 'pdf') {
        const objectURL = `data:application/pdf;base64,` + this.data.attachment;
        this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
      } else {
        const objectURL = `data:image/${fileExt};base64,` + this.data.attachment;
        this.attachmentSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    }
  }

  isPdf() {
    const fileExt = this.data.filename.split('.').pop();
    return fileExt.toLowerCase() == 'pdf';
  }
}
