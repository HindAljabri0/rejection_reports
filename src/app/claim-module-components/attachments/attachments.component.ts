import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { FileType } from '../models/attachmentRequest.model';
import { AttachmentView } from '../models/attachmentView.model';
import { updateCurrentAttachments, updateNewAttachments } from '../store/claim.actions';
import { ClaimPageMode, getPageMode, getRetrievedClaimProps } from '../store/claim.reducer';

@Component({
  selector: 'claim-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private store: Store) { }

  attachments: AttachmentView[];
  newAttachmentsPreview: { src: string | ArrayBuffer, name: string, fileType: FileType }[] = [];

  selectFilesError = null;
  fileType: FileType;

  pageMode: ClaimPageMode;

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getRetrievedClaimProps)),
      map(values => ({ mode: values[0], retrievedAttachments: values[1].attachments }))
    ).subscribe(({ mode, retrievedAttachments }) => {
      this.pageMode = mode;
      this.setData(retrievedAttachments)
    });
  }

  setData(attachments: AttachmentView[]) {
    this.attachments = [...attachments];
    this.newAttachmentsPreview = [];
    this.selectFilesError = null;
  }

  getImageOfBlob(attachment: AttachmentView) {
    let fileExt = attachment.fileName.split(".").pop();
    if (fileExt.toLowerCase() == 'pdf') {
      let objectURL = `data:application/pdf;base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      let objectURL = `data:image/${fileExt};base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

  }


  selectFile(event) {
    this.selectFilesError = null;
    let file = event.item(0);
    if (file instanceof File) {
      if (file.size == 0)
        return;
      let mimeType = file.type;
      if (mimeType.match(/image\/*/) == null && !mimeType.includes('pdf')) {
        this.fileType = null;
        return;
      }
      if (this.attachments.find(attachment => attachment.fileName == file.name) != undefined) {
        this.fileType = null;
        this.selectFilesError = "A file with the same name already exists."
        return;
      }
      if (this.newAttachmentsPreview.find(attachment => attachment.name == file.name) != undefined) {
        this.fileType = null;
        this.selectFilesError = "A file with the same name already exists."
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.fileType = null;
        this.selectFilesError = "Selected files should not be more than 2M."
        return;
      }
      this.preview(file);
    }
  }

  preview(file: File) {
    var mimeType = file.type;
    if (mimeType.includes('pdf')) {
      this.newAttachmentsPreview.push({ src: 'pdf', name: file.name, fileType: this.fileType });
      this.fileType = null;
      this.updateNewAttachments();
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.newAttachmentsPreview.push({ src: reader.result, name: file.name, fileType: this.fileType });
      this.fileType = null;
      this.updateNewAttachments();
    }

  }

  deleteCurrentAttachment(index: number) {
    this.attachments.splice(index, 1);
    this.updateCurrentAttachments();
  }
  deleteNewAttachment(index: number) {
    this.newAttachmentsPreview.splice(index, 1);
    this.updateNewAttachments();
  }

  updateCurrentAttachments() {
    this.store.dispatch(updateCurrentAttachments({ attachments: [...this.attachments] }));
    this.selectFilesError = null;
  }

  updateNewAttachments() {
    this.store.dispatch(updateNewAttachments({ attachments: [...this.newAttachmentsPreview] }));
    this.selectFilesError = null;
  }

  isPdf(attachment: AttachmentView) {
    let fileExt = attachment.fileName.split(".").pop();
    return fileExt.toLowerCase() == 'pdf';
  }

}
