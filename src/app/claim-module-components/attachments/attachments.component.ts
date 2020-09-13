import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'claim-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  attachments: { attachmentid: string, attachmentfile: string, filename: string, filetype: string, usercomment: string }[];
  
  ngOnInit() {
  }

  getImageOfBlob(attachment) {
    let fileExt = attachment.filename.split(".").pop();
    if (fileExt.toLowerCase() == 'pdf') {
      let objectURL = `data:application/pdf;base64,` + attachment.attachmentfile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      let objectURL = `data:image/${fileExt};base64,` + attachment.attachmentfile;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

  }

  isPdf(attachment) {
    let fileExt = attachment.filename.split(".").pop();
    return fileExt.toLowerCase() == 'pdf';
  }

}
