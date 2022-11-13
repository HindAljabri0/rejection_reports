import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AttachmentViewData } from './attachment-view-data';

@Component({
  selector: 'app-attachment-view-dialog',
  templateUrl: './attachment-view-dialog.component.html',
  styles: []
})
export class AttachmentViewDialogComponent implements OnInit {


  attachmentSource: SafeResourceUrl;

  constructor(
    private dialogRef: MatDialogRef<AttachmentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentViewData,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.setAttachmentSource();
  }

  closeDialog() {
    this.dialogRef.close();
  }
  setAttachmentSource() {
    const fileExt = this.data.filename.split('.').pop();
    if (this.data.attachment instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(this.data.attachment);
      reader.onload = (event) => {
        let data: string = reader.result as string;
        data = data.substring(data.indexOf(',') + 1);
        this.attachmentSource = data;
      };
    } else {
      if (fileExt.toLowerCase() === 'pdf') {
        //var blob = this.b64toBlob(this.data.attachment,'application/pdf')
        //const objectURL = `data:application/pdf;base64,` + blob;
        this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(this.data.attachment, 'application/pdf')));
      } else if(fileExt.toLowerCase() === 'mp4' || fileExt.toLowerCase() === 'webm'){
        this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(this.data.attachment, 'application/' + fileExt)));
      } else if(fileExt.toLowerCase() === 'mov') {
        this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(this.data.attachment, 'application/quicktime')));
      } else {
        const objectURL = `data:image/${fileExt};base64,` + this.data.attachment;
        this.attachmentSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    }
  }

  b64toBlob(b64Data, contentType) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      var slice = byteCharacters.slice(offset, offset + 512),
        byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  isPdf() {
    const fileExt = this.data.filename.split('.').pop();
    return fileExt.toLowerCase() === 'pdf';
  }

  isDicom() {
    const fileExt = this.data.filename.split('.').pop();
    return fileExt.toLowerCase() === 'dcm';
  }

  isVideo() {
    const fileExt = this.data.filename.split('.').pop();
    return fileExt.toLowerCase() == 'mp4' || fileExt.toLowerCase() == 'mov' || fileExt.toLowerCase() == 'webm';
  }
}
