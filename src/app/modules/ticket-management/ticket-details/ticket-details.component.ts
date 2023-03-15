import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AuthService } from 'src/app/services/authService/authService.service';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styles: []
})
export class TicketDetailsComponent implements OnInit {

  ticketId: string;
  status : string;
  providerName :string;
  ticket: any;

  replyVisible=false;

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
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private dialog: MatDialog,
    public authService: AuthService,
    private eclaimsTicketManagementService: EclaimsTicketManagementService
  ) { }

  ngOnInit() {
    this.ticketId = this.activatedRoute.snapshot.paramMap.get('ticketId');
    this.status = this.activatedRoute.snapshot.paramMap.get('status');
    this.sharedServices.provider;
    this.providerName = this.authService.getProviderName();
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
          console.log("ticket - "+this.ticket);
      }
    });
  }
  getFileIcon(name:string){
    const type = name.split('.').pop();
    if(type && type.includes("pdf")){
      return "./assets/file-types/ic-pdf.svg";
    }else if(type && (type.includes("jpg") || type.includes("png"))){
      return "./assets/file-types/ic-jpg.svg";
    }else if(type && (type.includes("xls") || type.includes("xlsx"))){
      return "./assets/file-types/ic-xls.svg";
    }else if(type && (type.includes("zip") || type.includes("rar"))){
      return "./assets/file-types/ic-zip.svg";
    }else{
      return "./assets/file-types/ic-other-file.svg";
    }
  }
  isNull(value: string) {
    return value == null ? '_' : value;
  }
}
