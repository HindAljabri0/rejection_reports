import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import { TicketManagementRoutingModule } from '../ticket-management-routing.module';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styles: []
})
export class CreateTicketComponent implements OnInit {
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

  type: string[] = ['Payer Down', 'Question', 'Problem', 'Enhancement', 'Request', 'Payers Request', 'integration',
    'Waseel Down', 'Reports', 'Service Task', 'New Provider Request', 'Error', 'F-Other',
    'Netsuite Issue', 'Sadad Payment'];

  payers: string[] = ['Tawunyia', 'MedGulf', 'GIG', 'Malath', 'AlRajhi Takaful', 'NextCare', 'Saico', 'MedNet',
    'Waseel', 'BUPA', 'Sehati', 'GLOBEMED', 'Nphies'];

  products: string[] = ['Portal Switch', 'Waseel Connect', 'PBM', 'Waseele Claim', 'RCM', 'Netsuite', 'Communication portal',
    'BI', 'LMS'];

  formTicket: FormGroup = this.formBuilder.group({
    subject: ['', Validators.required],
    email: ['', Validators.email],
    phoneNumber: ['', Validators.required],
    type: ['', Validators.required],
    payer: ['', Validators.required],
    product: ['', Validators.required],
    description: ['', Validators.required]
  });

  errors: string[];

  constructor(
    private sharedServices: SharedServices,
    public router: Router,
    public route: ActivatedRoute,
    private eclaimsTicketManagementService: EclaimsTicketManagementService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  onSubmit() {
    this.sharedServices.loadingChanged.next(true);
    this.errors = [''];
    if (this.formTicket.controls.subject.value == null || this.formTicket.controls.subject.value.trim() == '') {
      this.errors.push('Please Insert Subject.');
    }
    if (this.formTicket.controls.email.value == null || this.formTicket.controls.email.value.trim() == '') {
      this.errors.push('Please Insert Email.');
    }
    if (this.formTicket.controls.phoneNumber.value == null) {
      this.errors.push('Please Insert Phone Number.');
    }
    if (this.formTicket.controls.type.value == null || this.formTicket.controls.type.value.trim() == '') {
      this.errors.push('Please Select Type.');
    }
    if (this.formTicket.controls.payer.value == null || this.formTicket.controls.payer.value.trim() == '') {
      this.errors.push('Please Select Payer.');
    }
    if (this.formTicket.controls.product.value == null || this.formTicket.controls.product.value.trim() == '') {
      this.errors.push('Please Select Product.');
    }
    if (this.formTicket.controls.description.value == null || this.formTicket.controls.description.value.trim() == '') {
      this.errors.push('Please Insert Description.');
    }
    if (this.errors.join('') != '') {
      this.sharedServices.loadingChanged.next(false);
      this.dialogService.openMessageDialog(new MessageDialogData('Validation', this.errors.join('\n'), true));
      return;
    }
    var ticket = {
      'subject': this.formTicket.controls.subject.value,
      'email': this.formTicket.controls.email.value,
      'phoneNumber': this.formTicket.controls.phoneNumber.value,
      'description': this.formTicket.controls.description.value,
      'cfPayer': this.formTicket.controls.payer.value,
      'cfProduct': this.formTicket.controls.product.value,
      'type': this.formTicket.controls.type.value,
      // 'attachmentModels': []
    };
    this.eclaimsTicketManagementService.sendEclaimsTicket(this.sharedServices.providerId, ticket).subscribe(event => {
      console.log(event);
      if (event instanceof HttpResponse) {
        if (event.body['status'] == '200' || event.body['status'] == '201') {
          this.dialogService.openMessageDialog(
            new MessageDialogData('Success', event.body['message'], false)
          ).subscribe(result => {
            if (event.body['ticketId'] != null) {
              this.loadTicket(event.body['ticketId']);
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
                this.loadTicket(error.error['ticketId']);
              }
            });
          } else {
            this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true)).subscribe(result => {
              if (error.error['ticketId'] != null) {
                this.loadTicket(error.error['ticketId']);
              }
            });
          }
        } else if (error.status === 400 || error.status === 404) {
          if (error.error['errors'] != null) {
            this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
              if (error.error['ticketId'] != null) {
                this.loadTicket(error.error['ticketId']);
              }
            });
          }
          this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
            if (error.error['ticketId'] != null) {
              this.loadTicket(error.error['ticketId']);
            }
          });
        }
        if (error.error['message'] != null) {
          this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
            if (error.error['ticketId'] != null) {
              this.loadTicket(error.error['ticketId']);
            }
          });
        }
      }
      this.sharedServices.loadingChanged.next(false);
    });
  }

  loadTicket(ticketId: number) {
    this.router.navigate(['/ticket-management/tickets/details/', ticketId]);
  }

}
