import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { forEach } from 'jszip';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { AuthService } from 'src/app/services/authService/authService.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styles: []
})
export class TicketDetailsComponent implements OnInit {

  ticketId: string;
  status: string;
  providerName: string;
  UserName
  ticket: any;

  replyVisible = false;

  attachments = [];
  fileError: string = '';
  addedEle: number = 0;
  errors = [''];

  description = new FormControl();

  htmlContent: string;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '131px',
    maxHeight: '480px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '3',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    sanitize: true,
    toolbarPosition: 'bottom',
    toolbarHiddenButtons: [
      [
        'customClasses',
        'insertImage',
        'insertVideo',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private dialog: MatDialog,
    public authService: AuthService,
    private dialogService: DialogService,
    private eclaimsTicketManagementService: EclaimsTicketManagementService
  ) { }

  ngOnInit() {
    this.ticketId = this.activatedRoute.snapshot.paramMap.get('ticketId');
    this.status = this.activatedRoute.snapshot.paramMap.get('status');
    this.sharedServices.provider;
    this.providerName = this.authService.getProviderName();
    this.UserName = this.authService.getUserName();
    this.getTicketDetails(this.ticketId);
  }

  viewAttachment(e, item) {
    e.preventDefault();
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: {
        filename: item.attachmentName, attachment: item.url
      }, panelClass: ['primary-dialog', 'dialog-xl']
    });
  }
  getTicketDetails(ticketId: string) {
    this.eclaimsTicketManagementService.fetchEclaimsTicketDetails(this.sharedServices.providerId, ticketId).subscribe(event => {
      if (event instanceof HttpResponse) {
        //if (event.body != null && event.body instanceof Array)
        this.ticket = event.body;
        
        //console.log("ticket - "+this.ticket);
      }
    });
  }
  getFileIcon(name: string) {
    const type = name.split('.').pop();
    if (type && type.includes("pdf")) {
      return "./assets/file-types/ic-pdf.svg";
    } else if (type && (type.includes("jpg") || type.includes("png"))) {
      return "./assets/file-types/ic-jpg.svg";
    } else if (type && (type.includes("xls") || type.includes("xlsx") || type.includes("csv"))) {
      return "./assets/file-types/ic-xls.svg";
    } else if (type && (type.includes("zip") || type.includes("rar"))) {
      return "./assets/file-types/ic-zip.svg";
    } else if (type && (type.includes("doc") || type.includes("docx"))) {
      return "./assets/file-types/ic-word-file.svg";
    } else if (type && type.includes("txt")) {
      return "./assets/file-types/ic-txt.svg";
    } else if (type && type.includes("json")) {
      return "./assets/file-types/ic-js.svg";
    } else {
      return "./assets/file-types/ic-other-file.svg";
    }
  }
  isNull(value: string) {
    return value == null ? '_' : value;
  }
  addAttachment(event) {
    this.fileError = '';
    let sizeInMB = '';
    var attachmentName = event.target.files[0].name;
    var attachmentType = event.target.files[0].type;
    var attachment;
    sizeInMB = this.sharedServices.formatBytes(event.target.files[0].size);

    if (event.target.files[0].size > 20971520) {
      this.fileError = 'File must be less than or equal to 20 MB';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      attachment = data.substring(data.indexOf(',') + 1);
      this.attachments.push({
        "seq": this.addedEle + 1,
        "attachment": attachment,
        "attachmentName": attachmentName,
        "attachmentType": attachmentType
      });
      this.addedEle++;
      console.log(this.attachments)
    };
  }

  removeAttachment(attachment) {
    console.log(attachment);
    console.log(this.attachments.lastIndexOf(attachment));
    this.attachments.splice(this.attachments.lastIndexOf(attachment), 1);
    console.log(this.attachments);
  }

  getImageOfBlob(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    const objectURL = `data:image/${fileExt};base64,` + attachment.attachment;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  isPdf(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'pdf';
  }

  isVideo(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'mp4' || fileExt.toLowerCase() == 'mov' || fileExt.toLowerCase() == 'webm';
  }

  isDicom(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'dcm';
  }

  isXls(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'xls' || fileExt.toLowerCase() == 'xlsx';
  }

  isExe(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'exe';
  }

  isCsv(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'csv';
  }

  isZip(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'zip';
  }

  isWord(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'docx';
  }

  isText(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'txt';
  }

  isImage(attachment) {
    const fileExt = attachment.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'jpg' || fileExt.toLowerCase() == 'jpeg' || fileExt.toLowerCase() == 'png'
      || fileExt.toLowerCase() == 'gif' || fileExt.toLowerCase() == 'bmp' || fileExt.toLowerCase() == 'svg'
      || fileExt.toLowerCase() == 'psd';
  }

  onSubmit() {
    this.sharedServices.loadingChanged.next(true);
    this.errors = [''];
    if (this.description.value == null || this.description.value.trim() == '') {
      this.errors.push('Please Insert Description.');
    }
    if (this.errors.join('') != '') {
      this.sharedServices.loadingChanged.next(false);
      this.dialogService.openMessageDialog(new MessageDialogData('Validation', this.errors.join('\n'), true));
      return;
    }
    var ticket_reply = {
      'description': this.description.value,
      'ticketId': this.ticketId,
      'attachmentModels': this.attachments
    };
    console.log(JSON.stringify(ticket_reply));
    this.eclaimsTicketManagementService.sendTicketReply(this.sharedServices.providerId, ticket_reply).subscribe(event => {
      console.log(event);
      if (event instanceof HttpResponse) {
        if (event.body['status'] == '200' || event.body['status'] == '201') {
          this.dialogService.openMessageDialog(
            new MessageDialogData('Success', event.body['message'], false)
          ).subscribe(result => {
            if (event.body['ticketId'] != null) {
              this.replyVisible = false;
              this.description.setValue('');
              this.attachments = [];
              location.reload();
              //this.loadTicket(event.body['ticketId']);
            }
          });
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 500 || error.status == 0) {
          if (error.error['message'] != null) {
            this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
              if (error.error['ticketId'] != null) {
                this.replyVisible = false;
                //this.loadTicket(error.error['ticketId']);
              }
            });
          } else {
            this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true)).subscribe(result => {
              if (error.error['ticketId'] != null) {
                //this.loadTicket(error.error['ticketId']);
              }
            });
          }
        } else if (error.status === 400 || error.status === 404) {
          if (error.error['errors'] != null) {
            this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
              if (error.error['ticketId'] != null) {
                this.replyVisible = false;
                //this.loadTicket(error.error['ticketId']);
              }
            });
          }
          this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
            if (error.error['ticketId'] != null) {
              this.replyVisible = false;
              //this.loadTicket(error.error['ticketId']);
            }
          });
        }
        if (error.error['message'] != null) {
          this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
            if (error.error['ticketId'] != null) {
              //.loadTicket(error.error['ticketId']);
            }
          });
        }
      }
      this.sharedServices.loadingChanged.next(false);
    });
  }
}
