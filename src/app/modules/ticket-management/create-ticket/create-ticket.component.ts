import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { SharedServices } from 'src/app/services/shared.services';

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

  // type = 'Payer Down', 'Question', 'Problem', 'Enhancement', 'Request', 'Payers Request', 'integration', 'Waseel Down', 
  //   'Reports', 'Service Task', 'New Provider Request', 'Error', 'F-Other', 'Netsuite Issue', 'Sadad Payment';
  types = [];

  // payers = 'Tawunyia', 'MedGulf', 'GIG', 'Malath', 'AlRajhi Takaful', 'NextCare', 'Saico', 'MedNet',
  //   'Waseel', 'BUPA', 'Sehati', 'GLOBEMED', 'Nphies'
  payers = [];

  // products = 'Portal Switch', 'Waseel Connect', 'PBM', 'Waseele Claim', 'RCM', 'Netsuite', 'Communication portal', 'BI', 'LMS';
  products = [];

  formTicket: FormGroup = this.formBuilder.group({
    subject: ['', Validators.required],
    email: ['', Validators.email],
    phoneNumber: [''],
    type: [''],
    payer: [''],
    product: [''],
    description: ['']
  });

  errors: string[];
  attachments = [];
  fileError: string = '';
  addedEle: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private sharedServices: SharedServices,
    public router: Router,
    public route: ActivatedRoute,
    private eclaimsTicketManagementService: EclaimsTicketManagementService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fetchPayers();
    this.fetchProducts();
    this.fetchTypes();
  }

  fetchPayers() {
    this.eclaimsTicketManagementService.fetchPayerList().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.payers = event.body;
        }
      }
    });
  }
  fetchProducts() {
    this.eclaimsTicketManagementService.fetchProductList().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.products = event.body;
        }
      }
    });
  }
  fetchTypes() {
    this.eclaimsTicketManagementService.fetchTypeList().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.types = event.body;
        }
      }
    });
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
      'attachmentModels': this.attachments
    };
    this.eclaimsTicketManagementService.sendEclaimsTicket(this.sharedServices.providerId, ticket).subscribe(event => {
      console.log(event);
      if (event instanceof HttpResponse) {
        if (event.body['status'] == '200' || event.body['status'] == '201') {
          this.dialogService.openMessageDialog(
            new MessageDialogData('Success', event.body['message'], false)
          ).subscribe(result => {
            if (event.body['id'] != null) {
              this.loadTicket(event.body['id']);
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
                //this.loadTicket(error.error['ticketId']);
              }
            });
          }
          this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true)).subscribe(result => {
            if (error.error['ticketId'] != null) {
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

  loadTicket(ticketId: number) {
    //this.router.navigate(['/ticket-management/tickets/details/', ticketId]);
    this.router.navigateByUrl(`/ticket-management/tickets/details/${ticketId}/open`);
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

  // async viewAttachment(attachment) {
  //   console.log(attachment.attachment);
  //   if (this.isPdf(attachment) || this.isVideo(attachment) || this.isDicom(attachment)) {
  //     this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
  //       data: { filename: attachment.attachmentName, attachment: attachment.attachment },
  //       panelClass: ['primary-dialog', 'dialog-xl']
  //     });
  //   } else {
  //     const blob = new Blob([new Uint8Array(attachment.attachment)], {type: attachment.attachmentType });
  //     // // const objectURL = `data:image/${attachment.attachmentType};base64,` + attachment.attachment;
  //     // const base64Return = await fetch(`data:${attachment.attachmentType};base64,${attachment.attachment}`);
  //     // // const blob = await base64Return.blob();
  //     // var parts = [
  //     //   await base64Return.blob()
  //     // ];
  //     this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
  //       data: { filename: attachment.attachmentName, attachment: new File([blob], attachment.attachmentName) },
  //       panelClass: ['primary-dialog', 'dialog-xl']
  //     });
  //   }
  // }
}
