import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { AttachmentRequest, FileType } from '../models/attachmentRequest.model';
import { updateCurrentAttachments } from '../store/claim.actions';
import { ClaimPageMode, getClaim, getPageMode } from '../store/claim.reducer';

@Component({
  selector: 'claim-attachments',
  templateUrl: './attachments.component.html',
  styles: []
})
export class AttachmentsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private store: Store) { }

  attachments: AttachmentRequest[];
  // newAttachmentsPreview: { src: string | ArrayBuffer, name: string, fileType: FileType }[] = [];

  selectFilesError = null;
  fileType: FileType;

  pageMode: ClaimPageMode;

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], retrievedAttachments: values[1].attachment }))
    ).subscribe(({ mode, retrievedAttachments }) => {
      this.pageMode = mode;
      this.setData(retrievedAttachments);
    });
  }

  setData(attachments: AttachmentRequest[]) {
    if (attachments != null) {
      this.attachments = [...attachments];
    } else {
      this.attachments = [];
    }
    this.selectFilesError = null;
  }

  getImageOfBlob(attachment: AttachmentRequest) {
    const fileExt = attachment.fileName.split('.').pop();
    if (fileExt.toLowerCase() == 'pdf') {
      const objectURL = `data:application/pdf;base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      const objectURL = `data:image/${fileExt};base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

  }

  selectFile(event) {
    this.selectFilesError = null;
    const file = event.item(0);
    if (file instanceof File) {
      if (file.size == 0) {
        return;
      }
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null && !mimeType.includes('pdf')) {
        this.fileType = null;
        return;
      }
      if (this.attachments.find(attachment => attachment.fileName == file.name) != undefined) {
        this.fileType = null;
        this.selectFilesError = 'A file with the same name already exists.';
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.fileType = null;
        this.selectFilesError = 'Selected files should not be more than 2M.';
        return;
      }
      this.preview(file);
    }
  }

  preview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      let data: string = reader.result as string;
      data = data.substring(data.indexOf(',') + 1);
      this.attachments.push({ attachmentFile: data, fileName: file.name, fileType: this.fileType, userComment: null });
      this.fileType = null;
      this.updateCurrentAttachments();
    };
  }

  deleteCurrentAttachment(index: number) {
    this.attachments.splice(index, 1);
    this.updateCurrentAttachments();
  }

  updateCurrentAttachments() {
    this.store.dispatch(updateCurrentAttachments({ attachments: [...this.attachments] }));
    this.selectFilesError = null;
  }

  isPdf(attachment: AttachmentRequest) {
    const fileExt = attachment.fileName.split('.').pop();
    return fileExt.toLowerCase() == 'pdf';
  }

  editAttachment(type: FileType, index: number) {
    this.attachments[index] = { ...this.attachments[index], fileType: type };
    this.updateCurrentAttachments();
  }

}
