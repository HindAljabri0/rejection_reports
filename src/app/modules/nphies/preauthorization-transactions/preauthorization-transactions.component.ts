import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatDialogConfig } from '@angular/material';
import { ViewPreauthorizationDetailsComponent } from '../view-preauthorization-details/view-preauthorization-details.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import * as moment from 'moment';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { PreAuthorizationTransaction } from 'src/app/models/pre-authorization-transaction';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { Observable } from 'rxjs';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProcessedTransaction } from 'src/app/models/processed-transaction';
import { CommunicationRequest } from 'src/app/models/communication-request';
import { ProcessedTransactionsComponent } from './processed-transactions/processed-transactions.component';
import { CommunicationRequestsComponent } from './communication-requests/communication-requests.component';
import { CancelReasonModalComponent } from './cancel-reason-modal/cancel-reason-modal.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ReuseApprovalModalComponent } from './reuse-approval-modal/reuse-approval-modal.component';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { NphiesDownloadApprovalEligibilityService } from 'src/app/services/nphies_download_approval_eligibility/nphies-download-approval-eligibility.service';


@Component({
  selector: 'app-preauthorization-transactions',
  templateUrl: './preauthorization-transactions.component.html',
  styles: []
})
export class PreauthorizationTransactionsComponent implements OnInit {

  @ViewChild('processedTransactions', { static: false }) processedTransactions: ProcessedTransactionsComponent;
  @ViewChild('communicationRequests', { static: false }) communicationRequests: CommunicationRequestsComponent;

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;
  detailTopActionIcon = 'ic-download.svg';
  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;

  typeList = this.sharedDataService.claimTypeList;

  FormPreAuthTransaction: FormGroup = this.formBuilder.group({
    fromDate: [''],
    toDate: [''],
    payerId: [''],
    nphiesRequestId: [''],
    beneficiaryId: [''],
    beneficiaryName: [''],
    documentId: [''],
    status: [''],
    preAuthRefNo: [''],
    provClaimNo: [''],
    destinationId: [''],
    type: [''],
    RequestBundleId:['']
  });

  payersList = [];
  isSubmitted = false;
  errorMessage: string;
  transactionModel: PaginatedResult<PreAuthorizationTransaction>;
  transactions = [];
  approvalSearchRequest:ApprovalSearchRequest={}

  statusList = [
    { value: 'queued', name: 'Queued' },
    // { value: 'Processing Complete', name: 'Processing Complete' },
    { value: 'error', name: 'Error' },
    // { value: 'Partial Processing', name: 'Partial Processing' },
    { value: 'approved', name: 'Approved' },
    { value: 'rejected', name: 'Rejected' },
    { value: 'partial', name: 'Partially Approved' },
    { value: 'not-required', name: 'Not Required' },
    { value: 'pended', name: 'Pended' },
    { value: 'cancelled', name: 'Cancelled' }
  ];

  

  constructor(
    public sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private location: Location,
    private datePipe: DatePipe,
    private routeActive: ActivatedRoute,
    private dialog: MatDialog,
    private nphiesDownloadApprovalEligibilityService:NphiesDownloadApprovalEligibilityService,
    private downloadService: DownloadService,
    private dialogService: DialogService,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService,
    private sharedDataService: SharedDataService
  ) {

  }

  ngOnInit() {

    this.FormPreAuthTransaction.controls.fromDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.FormPreAuthTransaction.controls.toDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    this.routeActive.queryParams.subscribe(params => {



      if (params.fromDate != null) {
        const d1 = moment(moment(params.fromDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPreAuthTransaction.controls.fromDate.patchValue(this.datePipe.transform(d1, 'yyyy-MM-dd'));
      }

      if (params.toDate != null) {
        const d2 = moment(moment(params.toDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPreAuthTransaction.controls.toDate.patchValue(this.datePipe.transform(d2, 'yyyy-MM-dd'));
      }

      if (params.payerId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.payerId.patchValue(params.payerId);
      }

      if (params.destinationId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.destinationId.patchValue(params.destinationId);
      }

      if (params.nphiesRequestId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.nphiesRequestId.patchValue(params.nphiesRequestId);
      }

      if (params.beneficiaryId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.beneficiaryId.patchValue(parseInt(params.beneficiaryId));
      }

      if (params.documentId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.documentId.patchValue(parseInt(params.documentId));
      }

      if (params.beneficiaryName != null) {
        this.FormPreAuthTransaction.controls.beneficiaryName.patchValue(params.beneficiaryName);
      }

      if (params.status != null) {
        this.FormPreAuthTransaction.controls.status.patchValue(params.status);
      }

      if(params.type != null){
        this.FormPreAuthTransaction.controls.type.patchValue(params.type);
      }

      if (params.preAuthRefNo != null) {
        // const preAuthValue = params.preAuthRefNo.split(',').map(x => {
        //   const model: any = {};
        //   model.display = x.trim();
        //   model.value = x.trim();
        //   return model;
        // });
        this.FormPreAuthTransaction.controls.preAuthRefNo.patchValue(params.preAuthRefNo);
      }
      if (params.provClaimNo != null) {
        this.FormPreAuthTransaction.controls.provClaimNo.patchValue(params.provClaimNo);
      }

      if (params.page != null) {
        this.page = Number.parseInt(params.page, 10);
      } else {
        this.page = 0;
      }

      if (params.pageSize != null) {
        this.pageSize = Number.parseInt(params.pageSize, 10);
      } else {
        this.pageSize = 10;
      }

      this.getPayerList(true);

    });
  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    if (this.FormPreAuthTransaction.controls.beneficiaryName.value.length > 3) {
      this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormPreAuthTransaction.controls.beneficiaryName.value).subscribe(event => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body instanceof Array) {
            this.beneficiariesSearchResult = body;
          }
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {

        }
      });
    }
  }

  selectPayer(event) {
    this.FormPreAuthTransaction.patchValue({
      payerId: event.value.payerNphiesId,
      destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
    });
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormPreAuthTransaction.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id,
      documentId: beneficiary.documentId
    });
  }

  getPayerList(isFromUrl: boolean = false) {
    this.sharedServices.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;
          if (isFromUrl) {
            if (this.FormPreAuthTransaction.valid) {
              this.onSubmit();
            }
          } else {
            this.sharedServices.loadingChanged.next(false);
          }
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({
      previousPageIndex: this.paginator.pageIndex,
      pageIndex: index,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  paginatorAction(event) {
    this.manualPage = event.pageIndex;
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSubmit();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatorLength() {
    if (this.transactionModel != null) {
      return this.transactionModel.totalElements;
    } else {
      return 0;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPreAuthTransaction.valid) {
      this.sharedServices.loadingChanged.next(true);

      const model: any = {};
      model.fromDate = this.datePipe.transform(this.FormPreAuthTransaction.controls.fromDate.value, 'yyyy-MM-dd');
      model.toDate = this.datePipe.transform(this.FormPreAuthTransaction.controls.toDate.value, 'yyyy-MM-dd');

      if (this.FormPreAuthTransaction.controls.nphiesRequestId.value) {
        model.nphiesRequestId = this.FormPreAuthTransaction.controls.nphiesRequestId.value;
      }

      if (this.FormPreAuthTransaction.controls.payerId.value) {
        model.payerId = this.FormPreAuthTransaction.controls.payerId.value;
      }

      if (this.FormPreAuthTransaction.controls.destinationId.value) {
        model.destinationId = this.FormPreAuthTransaction.controls.destinationId.value;
      }

      // tslint:disable-next-line:max-line-length
      if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value && this.FormPreAuthTransaction.controls.documentId.value) {
        model.documentId = parseInt(this.FormPreAuthTransaction.controls.documentId.value, 10);
      }

      if (this.FormPreAuthTransaction.controls.status.value) {
        model.status = this.FormPreAuthTransaction.controls.status.value;
      }

      if (this.FormPreAuthTransaction.controls.preAuthRefNo.value) {
        model.preAuthRefNo = this.FormPreAuthTransaction.controls.preAuthRefNo.value;
        // model.preAuthRefNo = this.FormPreAuthTransaction.controls.preAuthRefNo.value.map(x => {
        //   return x.value;
        // });
      }

      if (this.FormPreAuthTransaction.controls.provClaimNo.value) {
        model.provClaimNo = this.FormPreAuthTransaction.controls.provClaimNo.value;
      }

      if (this.FormPreAuthTransaction.controls.type.value) {
        model.type = this.FormPreAuthTransaction.controls.type.value;
      }
      if (this.FormPreAuthTransaction.controls.RequestBundleId.value) {
        model.requestBundleId = this.FormPreAuthTransaction.controls.RequestBundleId.value;
      }


      model.page = this.page;
      model.pageSize = this.pageSize;

      this.editURL(model.fromDate, model.toDate);
      this.detailTopActionIcon = 'ic-download.svg';
      this.providerNphiesApprovalService.getApprovalRequestTransactions(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.transactionModel = new PaginatedResult(body, PreAuthorizationTransaction);
          this.transactions = this.transactionModel.content;
          
          this.transactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerId) ? this.payersList.filter(y => y.nphiesId === x.payerId)[0].englistName : '';
            x.claimType = this.typeList.find(y => y.value === x.claimType) ? this.typeList.filter(y => y.value === x.claimType)[0].name : '';
          });
          if (this.paginator) {
            const pages = Math.ceil((this.transactionModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.transactionModel.number;
            this.paginator.pageIndex = this.transactionModel.number;
            this.paginator.pageSize = this.transactionModel.size;
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
        this.sharedServices.loadingChanged.next(false);
        console.log(err);
      });

    }
  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/nphies/preauthorization-transactions?';

    if (this.FormPreAuthTransaction.controls.fromDate.value) {
      path += `fromDate=${this.datePipe.transform(this.FormPreAuthTransaction.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPreAuthTransaction.controls.toDate.value) {
      path += `toDate=${this.datePipe.transform(this.FormPreAuthTransaction.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPreAuthTransaction.controls.payerId.value) {
      path += `payerId=${this.FormPreAuthTransaction.controls.payerId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.destinationId.value) {
      path += `destinationId=${this.FormPreAuthTransaction.controls.destinationId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.nphiesRequestId.value) {
      path += `nphiesRequestId=${this.FormPreAuthTransaction.controls.nphiesRequestId.value}&`;
    }

    // tslint:disable-next-line:max-line-length
    if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value && this.FormPreAuthTransaction.controls.documentId.value) {
      path += `beneficiaryId=${this.FormPreAuthTransaction.controls.beneficiaryId.value}&`;
      path += `beneficiaryName=${this.FormPreAuthTransaction.controls.beneficiaryName.value}&`;
      path += `documentId=${this.FormPreAuthTransaction.controls.documentId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.status.value) {
      path += `status=${this.FormPreAuthTransaction.controls.status.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.preAuthRefNo.value) {
      path += `preAuthRefNo=${this.FormPreAuthTransaction.controls.preAuthRefNo.value}&`;
      // path += `preAuthRefNo=${this.FormPreAuthTransaction.controls.preAuthRefNo.value.map(x => {
      //   return x.value;
      // })}&`;
    }

    if (this.page > 0) {
      path += `page=${this.page}&`;
    }
    if (this.pageSize > 10) {
      path += `pageSize=${this.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }

  openReasonModal(requestId: number, responseId: number, reqType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      approvalRequestId: requestId,
      approvalResponseId: responseId,
      type: reqType
    };

    const dialogRef = this.dialog.open(CancelReasonModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  showMessage(_mainMessage, _subMessage, _mode, _hideNoButton, _yesButtonText, _errors = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      mainMessage: _mainMessage,
      subMessage: _subMessage,
      mode: _mode,
      hideNoButton: _hideNoButton,
      yesButtonText: _yesButtonText,
      errors: _errors
    };
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);
  }

  tabChange($event) {
    if ($event && $event.index === 1) {
      this.processedTransactions.getProcessedTransactions();
    } else if ($event && $event.index === 2) {
      this.communicationRequests.getCommunicationRequests();
    }
  }

  openDetailsDialoEv(event) {
    this.getTransactionDetails(event.requestId, event.responseId, null, event.notificationId, event.notificationStatus);
  }

  openDetailsDialogCR(event) {
    this.getTransactionDetails(event.requestId, null, event.communicationId, event.notificationId, event.notificationStatus);
  }

  openDetailsDialog(requestId, responseId) {
    this.getTransactionDetails(requestId, responseId, null, null, null);
  }

  getTransactionDetails(requestId, responseId, communicationId = null, notificationId, notificationStatus) {
    this.sharedServices.loadingChanged.next(true);

    let action: any;

    if (communicationId) {
      action = this.providerNphiesApprovalService.getTransactionDetailsFromCR(this.sharedServices.providerId, requestId, communicationId);
    } else {
      action = this.providerNphiesApprovalService.getTransactionDetails(this.sharedServices.providerId, requestId, responseId);
    }
    // tslint:disable-next-line:max-line-length
    action.subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          console.log("REsponse = " + JSON.stringify(body));
          if (communicationId) {
            body.communicationId = communicationId;
          }
          if (notificationId) {
            body.notificationId = notificationId;
          }
          if (notificationStatus) {
            body.notificationStatus = notificationStatus;
          }

          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog','view-preauth-details'];
          dialogConfig.data = {
            // tslint:disable-next-line:max-line-length
            detailsModel: body
          };

          const dialogRef = this.dialog.open(ViewPreauthorizationDetailsComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              if (result.openReUse) {
                this.OpenReuseApprovalModal(requestId, responseId);
              } else {
                if (!communicationId && notificationId) {
                  this.processedTransactions.getProcessedTransactions();
                } else if (communicationId && notificationId) {
                  this.communicationRequests.getCommunicationRequests();
                }
              }

            }
          }, error => { });
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  checkStatus(responseId: number) {
    this.sharedServices.loadingChanged.next(true);
    const model: any = {};
    model.approvalResponseId = responseId;
    this.providerNphiesApprovalService.statusCheck(this.sharedServices.providerId, model).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;

          if (body.errors && body.errors.length > 0) {
            const errors: any[] = [];
            body.errors.forEach(err => {
              err.coding.forEach(codex => {
                errors.push(codex.code + ' : ' + codex.display);
              });
            });
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
          } else if (body.statusCheckStatus && body.statusCheckStatus.toString().toLowerCase().trim() === 'failed') {
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK');
          }
          this.onSubmit();
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        } else if (error.status === 500) {
          this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        }
      }
    });
  }

  OpenReuseApprovalModal(requestId: number, responseId: number) {
    this.sharedServices.loadingChanged.next(true);

    let action: any;
    action = this.providerNphiesApprovalService.getTransactionDetails(this.sharedServices.providerId, requestId, responseId);

    // tslint:disable-next-line:max-line-length
    action.subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;

          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog'];
          dialogConfig.data = {
            // tslint:disable-next-line:max-line-length
            claimReuseId: requestId,
            detailsModel: body
          };

          const dialogRef = this.dialog.open(ReuseApprovalModalComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            if (result && result.IsReuse) {
              this.onSubmit();
            }
          }, error => { });
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });


  }

  async downloadSheetFormat() {
    if (this.detailTopActionIcon === 'ic-check-circle.svg') { return; }
    this.approvalSearchRequest={};
    let event;
    const model: any = {};
    this.approvalSearchRequest.providerId=this.sharedServices.providerId;
    this.approvalSearchRequest.fromDate = this.datePipe.transform(this.FormPreAuthTransaction.controls.fromDate.value, 'yyyy-MM-dd');
    this.approvalSearchRequest.toDate = this.datePipe.transform(this.FormPreAuthTransaction.controls.toDate.value, 'yyyy-MM-dd');

    if (this.FormPreAuthTransaction.controls.nphiesRequestId.value) {
      this.approvalSearchRequest.nphiesRequestId = this.FormPreAuthTransaction.controls.nphiesRequestId.value;
    }

    if (this.FormPreAuthTransaction.controls.payerId.value) {
      this.approvalSearchRequest.payerId = this.FormPreAuthTransaction.controls.payerId.value;
    }

    if (this.FormPreAuthTransaction.controls.destinationId.value) {
      this.approvalSearchRequest.destinationId = this.FormPreAuthTransaction.controls.destinationId.value;
    }

    // tslint:disable-next-line:max-line-length
    if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value && this.FormPreAuthTransaction.controls.documentId.value) {
      this.approvalSearchRequest.documentId = this.FormPreAuthTransaction.controls.documentId.value;
    }

    if (this.FormPreAuthTransaction.controls.status.value) {
      this.approvalSearchRequest.status = this.FormPreAuthTransaction.controls.status.value;
    }

    if (this.FormPreAuthTransaction.controls.preAuthRefNo.value) {
      this.approvalSearchRequest.preAuthRefNo = this.FormPreAuthTransaction.controls.preAuthRefNo.value;
      // model.preAuthRefNo = this.FormPreAuthTransaction.controls.preAuthRefNo.value.map(x => {
      //   return x.value;
      // });
    }


    if (this.FormPreAuthTransaction.controls.type.value) {
      this.approvalSearchRequest.type = this.FormPreAuthTransaction.controls.type.value;
    }
    if (this.FormPreAuthTransaction.controls.RequestBundleId.value) {
      this.approvalSearchRequest.requestBundleId = this.FormPreAuthTransaction.controls.RequestBundleId.value;
    }

    event = this.nphiesDownloadApprovalEligibilityService.downloadApprovleExcelsheet(this.approvalSearchRequest);
    if (event != null) {
      this.downloadService.startGeneratingDownloadFile(event)
        .subscribe(status => {
          if (status !== DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
    }}
  inquireApprovalRequest(requestId) {

    this.sharedServices.loadingChanged.next(true);

    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.inquireApprovalRequest(this.sharedServices.providerId, requestId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          this.transactions.filter(x => x.requestId === requestId)[0].status = body.outcome;
          this.transactions.filter(x => x.requestId === requestId)[0].inquiryStatus = body.inquiryOutcome;
          this.transactions.filter(x => x.requestId === requestId)[0].preAuthRefNo = body.preAuthRefNo;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.showMessage('Error', error.error.message, 'alert', true, 'OK');
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  get NewTransactionProcessed() {
    return this.sharedServices.unReadProcessedCount;
  }

  get NewComunicationRequests() {
    return this.sharedServices.unReadComunicationRequestCount;
  }

}
