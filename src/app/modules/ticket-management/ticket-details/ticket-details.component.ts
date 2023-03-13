import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styles: []
})
export class TicketDetailsComponent implements OnInit {

  ticketId: string;
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
    private eclaimsTicketManagementService: EclaimsTicketManagementService
  ) { }

  ngOnInit() {
    this.ticketId = this.activatedRoute.snapshot.paramMap.get('ticketId');
    this.getTicketDetails(this.ticketId);
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

  isNull(value: string) {
    return value == null ? '_' : value;
  }
}
