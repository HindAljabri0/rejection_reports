import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { AttachmentRequest, FileType } from '../models/attachmentRequest.model';
import { updateCurrentAttachments } from '../store/claim.actions';
import { ClaimPageMode, getClaim, getPageMode } from '../store/claim.reducer';
import { Subject } from 'rxjs';

@Component({
  selector: 'claim-attachments',
  templateUrl: './attachments.component.html',
  styles: []
})
export class AttachmentsComponent implements OnInit, OnDestroy {

  constructor(private sanitizer: DomSanitizer, private store: Store, private dialog: MatDialog) { }

  attachments: AttachmentRequest[];
  // newAttachmentsPreview: { src: string | ArrayBuffer, name: string, fileType: FileType }[] = [];

  selectFilesError = null;
  fileType: FileType;

  @Input() payerId = '';

  pageMode: ClaimPageMode;

  _onDestroy = new Subject<void>();

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      takeUntil(this._onDestroy),
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], retrievedAttachments: values[1].attachment }))
    ).subscribe(({ mode, retrievedAttachments }) => {
      this.pageMode = mode;
      this.setData(retrievedAttachments);
    });
    console.log(this.payerId);    
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
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
    } else if(fileExt.toLowerCase() === 'mp4' || fileExt.toLowerCase() === 'webm'){
      const objectURL = `data:video/${fileExt};base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else if(fileExt.toLowerCase() === 'mov') {
      const objectURL = `data:video/quicktime;base64,` + attachment.attachmentFile;
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
      var mimeType = file.type;
      if((mimeType === '' || mimeType === null) && file.name.split('.').pop().toLowerCase() === 'dcm')
      {
        mimeType = 'application/dicom';
      }
      console.log(mimeType);
      if (mimeType.match(/image\/*/) == null && !mimeType.includes('pdf') && !mimeType.includes('mp4') && !mimeType.includes('webm') && !mimeType.includes('quicktime') && !mimeType.includes('dicom')) {
        this.fileType = null;
        return;
      }
      if((mimeType.includes('mp4') || mimeType.includes('webm') || mimeType.includes('quicktime')) && this.payerId != '102') {
        this.fileType = null;
        this.selectFilesError = 'Video Attachment is not allowed for this payer.';
        return;
      }

      if (this.attachments.find(attachment => attachment.fileName == file.name) != undefined) {
        this.fileType = null;
        this.selectFilesError = 'A file with the same name already exists.';
        return;
      }
      if (file.size / 1024 / 1024 > 2 && (mimeType.match(/image\/*/) != null || mimeType.includes('pdf'))) {
        this.fileType = null;
        this.selectFilesError = 'Selected files should not be more than 2MB.';
        return;
      }else if(file.size / 1024 / 1024 > 30){
        this.fileType = null;
        this.selectFilesError = 'Selected files should not be more than 30MB.';
        return;
      }
      if ((mimeType.match(/video\/*/) != null || mimeType.includes('dicom')) && (this.attachments.find(attachment => this.isVideo(attachment)) != undefined || this.attachments.find(attachment => this.isDicom(attachment)) != undefined)) {
        this.fileType = null;
        this.selectFilesError = 'You Can Select Only One Dicom Or Video File.';
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

  isVideo(attachment: AttachmentRequest) {
    const fileExt = attachment.fileName.split('.').pop();
    return fileExt.toLowerCase() == 'mp4' || fileExt.toLowerCase() == 'mov' || fileExt.toLowerCase() == 'webm';
  }

  isDicom(attachment: AttachmentRequest) {
    const fileExt = attachment.fileName.split('.').pop();
    return fileExt.toLowerCase() == 'dcm';
  }

  editAttachment(type: FileType, index: number) {
    this.attachments[index] = { ...this.attachments[index], fileType: type };
    this.updateCurrentAttachments();
  }

  viewAttachment(attachment: AttachmentRequest) {
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: { filename: attachment.fileName, attachment: attachment.attachmentFile },
      panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

}
