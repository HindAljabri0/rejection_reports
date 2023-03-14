import { HttpClient } from '@angular/common/http';
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

  fileExt: string="";
  attachmentSource: SafeResourceUrl;

  constructor(
    private dialogRef: MatDialogRef<AttachmentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentViewData,
    private sanitizer: DomSanitizer, private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.setAttachmentSource();
  }

  closeDialog() {
    this.dialogRef.close();
  }
  setAttachmentSource() {
    this.fileExt = this.data.filename.split('.').pop();
    console.log("on for ticket " + this.fileExt);

    if (this.data.attachment instanceof File) {
      console.log("in the file section");
      const reader = new FileReader();
      reader.readAsDataURL(this.data.attachment);
      reader.onload = (event) => {
        let data: string = reader.result as string;
        data = data.substring(data.indexOf(',') + 1);
        this.attachmentSource = data;
      };
    } else {
      this.convertToBase64(this.data.attachment);
      //console.log("this.data.attachment " + blob);

    }
  }
  convertToBase64(url: string) {
    let base64_data: any = null;
    this.httpClient.get(url, { responseType: "blob" }).subscribe(blob => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        //Here you can do whatever you want with the base64 String
        let data = event.target.result as string;
        base64_data = data.substring(data.indexOf(',') + 1);
        //this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(this.attachmentSource, 'application/pdf')))
        console.log("File in Base64: ", base64_data);
        if (this.fileExt.toLowerCase() === 'pdf') {
          let _blob = this.b64toBlob(base64_data,'application/pdf')
          console.log(_blob);
          //const objectURL = `data:application/pdf;base64,` + blob;
          this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(base64_data, 'application/pdf')));
        } else if (this.fileExt.toLowerCase() === 'xls' || this.fileExt.toLowerCase() === 'xlsx') {
          //var blob = this.b64toBlob(this.data.attachment,'application/pdf')
          //const objectURL = `data:application/pdf;base64,` + blob;
          this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(base64_data, 'application/' + this.fileExt)));
        } else if (this.fileExt.toLowerCase() === 'mp4' || this.fileExt.toLowerCase() === 'webm') {
          this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(base64_data, 'application/' + this.fileExt)));
        } else if (this.fileExt.toLowerCase() === 'mov') {
          this.attachmentSource = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.b64toBlob(base64_data, 'application/quicktime')));
        } else {
          const objectURL = `data:image/${this.fileExt};base64,` + base64_data;
          this.attachmentSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
      };

      reader.onerror = (event: any) => {
        console.log("File could not be read: " + event.target.error.code);
        base64_data = null;
      };
    });
    //return base64_data;
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
  isExcel() {
    const fileExt = this.data.filename.split('.').pop();
    return fileExt.toLowerCase() === 'xls' || fileExt.toLowerCase() === 'xlsx';
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
