import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { getClaim, getIsRetrievedClaim, getPageMode } from '../store/claim.reducer';

@Component({
  selector: 'claim-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private store: Store) { }

  attachments: { attachmentid: string, attachmentfile: string, filename: string, filetype: string, usercomment: string }[];

  ngOnInit() {
    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim)),
      withLatestFrom(this.store.select(getPageMode)),
      map(values => ({ isRetrieved: values[0][0], claim: values[0][1], mode: values[1] }))
    ).subscribe(
      values => {
        if(values.isRetrieved){
          this.attachments = values.claim.attachment.map(att => ({
            attachmentid: null,
            attachmentfile: att.attachmentFile.toString(),
            filename: att.fileName,
            filetype: `${att.fileType}`,
            usercomment: att.userComment
          }));
        }
      }
    )
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
